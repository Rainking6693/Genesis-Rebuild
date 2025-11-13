import { validateSync } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Offset } from './offset.entity';
import { User } from '../user/user.entity';
import { OffsetService } from './offset.service';
import { TeamService } from '../team/team.service';
import { Team } from '../team/team.entity';
import { PurchaseDto } from './dto/purchase.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';

@Injectable()
export class PurchaseController {
  constructor(
    private readonly offsetService: OffsetService,
    private readonly teamService: TeamService,
    private readonly offsetRepository: Repository<Offset>,
    private readonly userRepository: Repository<User>,
  ) {}

  @UseGuards(JwtAuthGuard)
  async purchase(purchaseData: PurchaseDto): Promise<void> {
    const { teamId, offsetId } = purchaseData;

    // Validate input data
    const validationErrors = validateSync(purchaseData);
    if (validationErrors.length > 0) {
      throw new BadRequestException('Invalid input data', { errors: validationErrors });
    }

    // Check if the user is part of the team
    const user = await this.userRepository.findOne({
      where: { id: purchaseData.userId },
      relations: ['teams'],
    });
    if (!user || !user.teams.includes(teamId)) {
      throw new ForbiddenException('User is not part of the team');
    }

    // Check if the offset is available
    const offset = await this.offsetRepository.findOne({ where: { id: offsetId } });
    if (!offset) {
      throw new NotFoundException('Offset not found');
    }

    // Check if the team has enough budget to purchase the offset
    const team = await this.teamService.findOne(teamId);
    if (team.budget < offset.price) {
      throw new ForbiddenException('Team does not have enough budget to purchase the offset');
    }

    // Deduct the budget and update the team
    team.budget -= offset.price;
    await this.teamService.save(team);

    // Update the offset's status and update the team's carbon footprint
    offset.status = Offset.Status.PURCHASED;
    await this.offsetService.save(offset);

    // Notify the team about the purchase
    await this.teamService.notifyTeam(team, 'Offset purchased');
  }
}

import { validateSync } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Offset } from './offset.entity';
import { User } from '../user/user.entity';
import { OffsetService } from './offset.service';
import { TeamService } from '../team/team.service';
import { Team } from '../team/team.entity';
import { PurchaseDto } from './dto/purchase.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';

@Injectable()
export class PurchaseController {
  constructor(
    private readonly offsetService: OffsetService,
    private readonly teamService: TeamService,
    private readonly offsetRepository: Repository<Offset>,
    private readonly userRepository: Repository<User>,
  ) {}

  @UseGuards(JwtAuthGuard)
  async purchase(purchaseData: PurchaseDto): Promise<void> {
    const { teamId, offsetId } = purchaseData;

    // Validate input data
    const validationErrors = validateSync(purchaseData);
    if (validationErrors.length > 0) {
      throw new BadRequestException('Invalid input data', { errors: validationErrors });
    }

    // Check if the user is part of the team
    const user = await this.userRepository.findOne({
      where: { id: purchaseData.userId },
      relations: ['teams'],
    });
    if (!user || !user.teams.includes(teamId)) {
      throw new ForbiddenException('User is not part of the team');
    }

    // Check if the offset is available
    const offset = await this.offsetRepository.findOne({ where: { id: offsetId } });
    if (!offset) {
      throw new NotFoundException('Offset not found');
    }

    // Check if the team has enough budget to purchase the offset
    const team = await this.teamService.findOne(teamId);
    if (team.budget < offset.price) {
      throw new ForbiddenException('Team does not have enough budget to purchase the offset');
    }

    // Deduct the budget and update the team
    team.budget -= offset.price;
    await this.teamService.save(team);

    // Update the offset's status and update the team's carbon footprint
    offset.status = Offset.Status.PURCHASED;
    await this.offsetService.save(offset);

    // Notify the team about the purchase
    await this.teamService.notifyTeam(team, 'Offset purchased');
  }
}