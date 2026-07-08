import { useCallback, useMemo } from 'react';

export function useToast() {
  const toast = useCallback(({ title, description, variant = 'default' }) => {
    console.log(`[Toast] [${variant}] ${title} - ${description}`);
    
    let container = document.getElementById('klanvision-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'klanvision-toast-container';
      container.style.position = 'fixed';
      container.style.bottom = '24px';
      container.style.right = '24px';
      container.style.zIndex = '99999';
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.gap = '10px';
      document.body.appendChild(container);
    }
    
    const card = document.createElement('div');
    card.style.background = variant === 'destructive' ? '#EF4444' : '#10B981';
    card.style.color = '#FFFFFF';
    card.style.padding = '14px 20px';
    card.style.borderRadius = '12px';
    card.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
    card.style.fontFamily = 'Poppins, sans-serif';
    card.style.fontSize = '13px';
    card.style.minWidth = '280px';
    card.style.maxWidth = '380px';
    card.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    
    card.innerHTML = `
      <div style="font-weight: 700; margin-bottom: 3px; font-size: 14px;">${title}</div>
      <div style="font-size: 12px; opacity: 0.9;">${description}</div>
    `;
    
    container.appendChild(card);
    
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 10);
    
    setTimeout(() => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(-20px)';
      setTimeout(() => {
        card.remove();
      }, 300);
    }, 4000);
  }, []);

  return useMemo(() => ({ toast }), [toast]);
}
