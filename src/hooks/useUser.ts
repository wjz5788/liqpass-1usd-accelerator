import { useUserStore } from '../store/userStore';

export function useUser() {
  const {
    user,
    wallet,
    isLoading,
    error,
    setUser,
    setWallet,
    setLoading,
    setError,
    connectWallet,
    disconnectWallet,
    login,
    logout,
    updateUserProfile,
  } = useUserStore();

  // 检查用户是否已登录
  const isLoggedIn = !!user;
  
  // 检查钱包是否已连接
  const isWalletConnected = !!wallet?.connected;

  // 处理钱包连接
  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      return true;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      return false;
    }
  };

  // 处理钱包断开连接
  const handleDisconnectWallet = () => {
    disconnectWallet();
  };

  // 处理用户登录
  const handleLogin = async (email: string, password: string) => {
    try {
      const loggedInUser = await login(email, password);
      return { success: true, user: loggedInUser };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Login failed' };
    }
  };

  // 处理用户登出
  const handleLogout = () => {
    logout();
  };

  // 更新用户资料
  const handleUpdateProfile = async (data: Partial<{ id: string; address: string; avatar: string; username: string; email?: string }>) => {
    try {
      const updatedUser = await updateUserProfile(data as any);
      return { success: true, user: updatedUser };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to update profile' };
    }
  };

  return {
    user,
    wallet,
    isLoading,
    error,
    isLoggedIn,
    isWalletConnected,
    connectWallet: handleConnectWallet,
    disconnectWallet: handleDisconnectWallet,
    login: handleLogin,
    logout: handleLogout,
    updateUserProfile: handleUpdateProfile,
    setUser,
    setWallet,
    setLoading,
    setError,
  };
}
