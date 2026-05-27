import { inject } from 'vue'

export function useAgGridTheme() {
  const agGridTheme = inject('agGridTheme')

  return {
    theme: agGridTheme,
  }
}
