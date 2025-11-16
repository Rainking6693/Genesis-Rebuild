from infrastructure.payments.wallet_manager import WalletManager


def test_wallet_manager_initializes_all_agents():
    manager = WalletManager()
    balances = manager.get_all_balances()
    assert len(balances) == len(WalletManager.AGENT_LIST)
    assert all(balance == 1000.0 for balance in balances.values())


def test_low_balance_detection():
    emptied = {agent: 0.0 for agent in WalletManager.AGENT_LIST}
    manager = WalletManager(agent_balances=emptied)
    low = manager.get_low_balance_agents(min_balance=1.0)
    assert set(low) == set(WalletManager.AGENT_LIST)
