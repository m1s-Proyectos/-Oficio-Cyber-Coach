export type PreventionSurface = 'email' | 'call' | 'sms' | 'result';

export interface PreventionPresentation {
  surface: PreventionSurface;
  appLabel: string;
  time: string;
  subtitle: string;
  from?: string;
  subject?: string;
  caller?: string;
  smsCode?: string;
}
