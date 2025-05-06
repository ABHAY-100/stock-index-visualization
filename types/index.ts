export interface IndexData {
  index_name: string;
  index_date: string;
  open_index_value: string;
  high_index_value: string;
  low_index_value: string;
  closing_index_value: string;
  points_change: string;
  change_percent: string;
  volume: string;
  turnover_rs_cr: string;
  pe_ratio: string;
  pb_ratio: string;
  div_yield: string;
  [key: string]: string;
}

export interface CompanyData {
  date: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  company: string;
  [key: string]: string;
}
