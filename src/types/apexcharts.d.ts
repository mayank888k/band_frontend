declare module 'apexcharts' {
  export interface ApexOptions {
    chart?: {
      background?: string;
      toolbar?: {
        show?: boolean;
      };
      type?: string;
    };
    colors?: string[];
    dataLabels?: {
      enabled?: boolean;
    };
    stroke?: {
      curve?: string;
      width?: number;
    };
    xaxis?: {
      categories?: string[];
      labels?: {
        style?: {
          colors?: string | string[];
        };
      };
      lines?: {
        show?: boolean;
      };
    };
    yaxis?: {
      labels?: {
        style?: {
          colors?: string | string[];
        };
      };
    };
    tooltip?: {
      theme?: string;
    };
    grid?: {
      borderColor?: string;
      xaxis?: {
        lines?: {
          show?: boolean;
        };
      };
    };
    legend?: {
      position?: string;
      labels?: {
        colors?: string | string[];
      };
    };
    labels?: string[];
    responsive?: Array<{
      breakpoint?: number;
      options?: {
        chart?: {
          height?: number;
        };
        legend?: {
          position?: string;
        };
      };
    }>;
    [key: string]: any;
  }
}

export {}; 