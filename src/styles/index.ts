
// Import base styles
import './base.css';
import './animations.css';
// Remove components.css import since it doesn't exist
// The components styles are in the components directory which we import at the bottom
import './testimonials.css';
import './carousel.css';
// responsive.css doesn't exist, we import from responsive folder instead (see below)
import './theme.css';
import './float-animation.css';
import './variables.css';
import './base-elements.css';
import './ui-effects.css';
import './buttons.css';
import './keyframes.css';
import './animations-utils.css';
import './mobile.css';
import './layout.css';
import './light-mode.css';
import './dark-mode.css';
import './global-colors.css';

// Import responsive styles
import './responsive/index.css';
// This is the proper way to import component styles
import './components/index.css';

export {};
