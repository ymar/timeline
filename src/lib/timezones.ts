const timezones = [
  { value: 'Europe/Amsterdam', label: '(GMT+01:00) Amsterdam' },
  { value: 'Europe/Berlin', label: '(GMT+01:00) Berlin' },
  { value: 'Europe/Brussels', label: '(GMT+01:00) Brussels' },
  { value: 'Europe/Paris', label: '(GMT+01:00) Paris' },
  { value: 'Europe/Rome', label: '(GMT+01:00) Rome' },
  { value: 'Europe/London', label: '(GMT+00:00) London' },
  { value: 'Europe/Dublin', label: '(GMT+00:00) Dublin' },
  { value: 'Europe/Lisbon', label: '(GMT+00:00) Lisbon' },
  { value: 'Europe/Madrid', label: '(GMT+01:00) Madrid' },
  { value: 'Europe/Copenhagen', label: '(GMT+01:00) Copenhagen' },
  { value: 'Europe/Stockholm', label: '(GMT+01:00) Stockholm' },
  { value: 'Europe/Oslo', label: '(GMT+01:00) Oslo' },
  { value: 'Europe/Helsinki', label: '(GMT+02:00) Helsinki' },
  { value: 'Europe/Athens', label: '(GMT+02:00) Athens' },
  { value: 'Europe/Istanbul', label: '(GMT+03:00) Istanbul' },
  { value: 'America/New_York', label: '(GMT-05:00) New York' },
  { value: 'America/Chicago', label: '(GMT-06:00) Chicago' },
  { value: 'America/Denver', label: '(GMT-07:00) Denver' },
  { value: 'America/Los_Angeles', label: '(GMT-08:00) Los Angeles' },
  { value: 'Asia/Dubai', label: '(GMT+04:00) Dubai' },
  { value: 'Asia/Singapore', label: '(GMT+08:00) Singapore' },
  { value: 'Asia/Tokyo', label: '(GMT+09:00) Tokyo' },
  { value: 'Australia/Sydney', label: '(GMT+10:00) Sydney' },
  { value: 'Pacific/Auckland', label: '(GMT+12:00) Auckland' },
] as const;

export type Timezone = typeof timezones[number]['value'];

export default timezones;
