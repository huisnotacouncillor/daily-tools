/**
 * Utility functions for accessibility
 */

/**
 * Creates a visually hidden element that is still accessible to screen readers
 * @param id - Optional ID for the element
 * @returns Props to spread on an element to make it visually hidden
 */
export function visuallyHidden(id?: string) {
  return {
    id,
    className: 'sr-only',
    style: {
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: '0',
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      borderWidth: '0',
    },
  };
}

/**
 * Creates an accessible label for an input
 * @param inputId - ID of the input element
 * @returns Props for the label element
 */
export function accessibleLabel(inputId: string) {
  return {
    htmlFor: inputId,
    id: `${inputId}-label`,
    className: 'block text-sm font-medium mb-2',
  };
}

/**
 * Creates an accessible description for an input
 * @param inputId - ID of the input element
 * @returns Props for the description element
 */
export function accessibleDescription(inputId: string) {
  return {
    id: `${inputId}-description`,
    className: 'text-sm text-muted-foreground mt-1',
  };
}

/**
 * Creates ARIA attributes for an input with a description
 * @param descriptionId - ID of the description element
 * @returns ARIA attributes for the input
 */
export function ariaDescribedBy(descriptionId: string) {
  return {
    'aria-describedby': descriptionId,
  };
}

/**
 * Creates ARIA attributes for an input with an error
 * @param errorId - ID of the error element
 * @param hasError - Whether the input has an error
 * @returns ARIA attributes for the input
 */
export function ariaInvalid(errorId: string, hasError: boolean) {
  return {
    'aria-invalid': hasError,
    'aria-errormessage': hasError ? errorId : undefined,
  };
}

/**
 * Creates ARIA attributes for a button that controls a section
 * @param controlsId - ID of the controlled section
 * @param expanded - Whether the section is expanded
 * @returns ARIA attributes for the button
 */
export function ariaExpanded(controlsId: string, expanded: boolean) {
  return {
    'aria-controls': controlsId,
    'aria-expanded': expanded,
  };
}

/**
 * Creates ARIA attributes for a tab
 * @param panelId - ID of the tab panel
 * @param selected - Whether the tab is selected
 * @returns ARIA attributes for the tab
 */
export function ariaTab(panelId: string, selected: boolean) {
  return {
    role: 'tab',
    'aria-controls': panelId,
    'aria-selected': selected,
    tabIndex: selected ? 0 : -1,
  };
}

/**
 * Creates ARIA attributes for a tab panel
 * @param tabId - ID of the tab
 * @returns ARIA attributes for the tab panel
 */
export function ariaTabPanel(tabId: string) {
  return {
    role: 'tabpanel',
    'aria-labelledby': tabId,
    tabIndex: 0,
  };
}

/**
 * Creates ARIA attributes for a dialog
 * @param titleId - ID of the dialog title
 * @returns ARIA attributes for the dialog
 */
export function ariaDialog(titleId: string) {
  return {
    role: 'dialog',
    'aria-modal': true,
    'aria-labelledby': titleId,
  };
}

/**
 * Creates ARIA attributes for a tooltip
 * @param tooltipId - ID of the tooltip
 * @returns ARIA attributes for the element with the tooltip
 */
export function ariaTooltip(tooltipId: string) {
  return {
    'aria-describedby': tooltipId,
  };
}

/**
 * Creates ARIA attributes for a live region
 * @param politeness - Politeness level (polite or assertive)
 * @returns ARIA attributes for the live region
 */
export function ariaLive(politeness: 'polite' | 'assertive' = 'polite') {
  return {
    'aria-live': politeness,
    role: 'status',
  };
}
