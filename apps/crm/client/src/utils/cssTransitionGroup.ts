const CSS_ROOT = document.documentElement;

// Modal Default
// Transition values in ms
export const CTG_ENTER_MODAL = 1500;
export const CTG_EXIT_MODAL = 250;

export const CTG_ON_ENTER_CSS_ROOT = (cssProperty: string, cssValue: string) => {
  CSS_ROOT.style.setProperty(cssProperty, cssValue);
};

export const CTG_ON_EXITED_CSS_ROOT = (cssProperty: string) => {
  CSS_ROOT.style.removeProperty(cssProperty);
};
