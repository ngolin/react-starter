import { MetaState } from '@/lib/statex';

export const visibility = new MetaState<{ visible: boolean }>({ visible: true });

if (typeof window !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    visibility.dispatch('visible', document.visibilityState !== 'hidden');
  });
}

export const usePageVisible = () => {
  return visibility.use('visible');
};
