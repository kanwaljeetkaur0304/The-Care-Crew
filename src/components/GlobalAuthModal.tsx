import { useUI } from '../context/UIContext';
import AuthModal from './AuthModal';

export default function GlobalAuthModal() {
  const { authModalOpen, closeAuthModal } = useUI();
  return <AuthModal isOpen={authModalOpen} onClose={closeAuthModal} />;
}
