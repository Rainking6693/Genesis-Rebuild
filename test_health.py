from infrastructure.replay_buffer import ReplayBuffer
rb = ReplayBuffer()
stats = rb.get_statistics()
print('System Status:', stats)
