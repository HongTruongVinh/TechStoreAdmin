import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BreadcrumbsComponent } from "../../../shared/breadcrumbs/breadcrumbs.component";
import { Store } from '@ngrx/store';
import { NgApexchartsModule } from 'ng-apexcharts';
import { fetchfeedbackdataData, fetchpropertydataData, fetchrentproprtydataData, fetchsalepropertydataData } from '../../../store/RealEstate/realEstate.action';
import { selectData, selectfeedData, selectrentData, selectsaleData } from '../../../store/RealEstate/realEstate-selector';
import ApexCharts from 'apexcharts';
import { NgxEchartsModule } from 'ngx-echarts';
import { SimplebarAngularModule } from 'simplebar-angular';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CountUpComponent } from '../../charts/count-up/count-up.component';
import { FlatpickrDirective, provideFlatpickrDefaults } from 'angularx-flatpickr';
import { NgxEchartsDirective } from 'ngx-echarts';
import { StatisticsService } from '../../../core/services/statistics.service';
import { ChartData } from '../../../models/models/statistics/chart-data.model';
import { DashboardOverviewModel } from '../../../models/models/statistics/dashboard-overview.model';
import { RadialBarChartData } from '../../../models/models/statistics/chart-data.model';
import { ProductModel } from '../../../models/models/product/product.model';
import { FullImageUrlPipe } from "../../../pipeTransform/full-image-url.pipe";
import { AdminProductListItemModel } from '../../../models/models/product/admin-product-list-item.model';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [
    BreadcrumbsComponent,
    FormsModule,
    CommonModule,
    NgApexchartsModule,
    NgxEchartsModule,
    SimplebarAngularModule,
    TabsModule,
    CountUpComponent,
    FlatpickrDirective,
    BsDropdownModule,
    NgxEchartsDirective,
    FullImageUrlPipe
],
   providers: [provideFlatpickrDefaults()],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent {
breadCrumbItems!: Array<{}>;
  processingOrdersChart: any;
  deliveringOrdersChart: any;
  complatedOrdersChart: any;
  orderChart: any;

  categoryChart: any;
  categoryChartData: any;

  totalrevenueChart: any;
  totalRevenue: number = 0;
  totalrevenueChartData: ChartData[] = [];


  totalincomeChart: any;
  totalIncome: number = 0;
  totalOrdersChart: any;
  totalOrders: number = 0;

  refundChart: any;
  miniChart6: any;
  miniChart7: any;
  miniChart8: any;
  miniChart9: any;

  hotProducts: any;
  feedbackData: any;
  bestSellProducts: AdminProductListItemModel[] = [];
  bestRatedProducts: AdminProductListItemModel[] = [];
  currentDate: any;
  currentTab = 'purchased';



  sortValue: any = 'Property Name'

  overviewData: DashboardOverviewModel = {
    processingOfPendingOrders: {
      goal: 0,
      progress: 0,
      progressPercent: 0,
    },
    deliveringOfProcessingOrders: {
      goal: 0,
      progress: 0,
      progressPercent: 0,
    },
    complatedOfDeliveringOrders: {
      goal: 0,
      progress: 0,
      progressPercent: 0,
    },
    totalRevenueChartData: [],
    totalIncomeChartData: [],
    totalOrdersChartData: [],
    categoryChartData: [],
    hotProducts: [],
    bestSellProducts: [],
    bestRatedProducts: [],
    loyalCustomer: [],
    recentlyActions: [],
  };

  constructor(
    public store: Store,
    private statisticsService: StatisticsService
  ) {
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.currentDate = { from: firstDay, to: lastDay }
  }

  ngOnInit(): void {
    
    this.loadData();


    this.breadCrumbItems = [
      { label: 'Bảng điều khiển' },
      { label: 'Tổng quan', active: true }
    ];

    // Chart Color Data Get Function
    this._deliveringOrdersChart('["--tb-warning"]');
    this._complatedOrdersChart('["--tb-secondary"]');
    this._residencypropertyChart('["--tb-success"]');
    
    
    this._propetryrentChart('["--tb-info"]');
    this._miniChart7('["--tb-primary"]');
    this._miniChart8('["--tb-warning"]');
    this._miniChart9('["--tb-success"]');

    //store data
    // this.store.dispatch(fetchpropertydataData());
    // this.store.select(selectData).subscribe((data) => {
    //   this.propertylist = data;
    // });
    // this.store.dispatch(fetchfeedbackdataData());
    // this.store.select(selectfeedData).subscribe((data) => {
    //   this.feedbackData = data;
    // });
    // this.store.dispatch(fetchsalepropertydataData());
    // this.store.select(selectsaleData).subscribe((data) => {
    //   this.salepropertyData = data;
    // });
    // this.store.dispatch(fetchrentproprtydataData());
    // this.store.select(selectrentData).subscribe((data) => {
    //   this.rentpropertyData = data;
    // });

  }

  loadData() {
    
    this.statisticsService.GetDashboardOverviewData().subscribe((res) => {
      if (res.retCode == 0) {
        if (res.data) {
          this.overviewData = res.data;
          this.hotProducts = res.data.hotProducts;
          this.bestSellProducts = res.data.bestSellProducts;
          this.bestRatedProducts = res.data.bestRatedProducts;

          this.totalRevenue = this.overviewData.totalRevenueChartData.reduce((sum, item) => sum + item.value, 0);
          this.totalIncome = this.overviewData.totalIncomeChartData.reduce((sum, item) => sum + item.value, 0);
          this.totalOrders = this.overviewData.totalOrdersChartData.reduce((sum, item) => sum + item.value, 0);

          const rawData = res.data.categoryChartData;
          const totalValue = rawData.reduce((sum, item) => sum + item.value, 0);
          this.categoryChartData = [
            ...rawData,
             // make an record to fill the bottom 50%
            {
              value: totalValue,
              itemStyle: {
                // stop the chart from rendering this piece
                color: 'none',
                decal: { symbol: 'none' }
              },
              label: { show: false }
            }
          ];

          this._categoryChart('["--tb-primary", "--tb-secondary", "--tb-light","--tb-danger", "--tb-success"]', this.categoryChartData);
          
          this._totalrevenueChart('["--tb-primary"]', res.data.totalRevenueChartData);

          this._totalincomeChart('["--tb-success"]', res.data.totalIncomeChartData);

          this._totalOrdersChart('["--tb-danger"]', res.data.totalOrdersChartData);

          this._processingOrdersChart('["--tb-primary"]');

          this._miniChart6('["--tb-secondary"]', res.data.totalOrdersChartData);

        } else {

        }
      } else {
        
      }
    })
  }

  // Change Tab Content
  changeTab(tab: string) {
    this.currentTab = tab;
  }

  // Chart Colors Set
  private getChartColorsArray(colors: any) {
    colors = JSON.parse(colors);
    return colors.map(function (value: any) {
      var newValue = value.replace(" ", "");
      if (newValue.indexOf(",") === -1) {
        var color = getComputedStyle(document.documentElement).getPropertyValue(newValue);
        if (color) {
          color = color.replace(" ", "");
          return color;
        }
        else return newValue;;
      } else {
        var val = value.split(',');
        if (val.length == 2) {
          var rgbaColor = getComputedStyle(document.documentElement).getPropertyValue(val[0]);
          rgbaColor = "rgba(" + rgbaColor + "," + val[1] + ")";
          return rgbaColor;
        } else {
          return newValue;
        }
      }
    });
  }

  /**
  * Sale Charts
  */
  private _processingOrdersChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.processingOrdersChart = {
      series: [this.overviewData.processingOfPendingOrders.progressPercent],
      chart: {
        width: 110,
        height: 110,
        type: 'radialBar',
        sparkline: {
          enabled: true
        }
      },
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 0,
            size: '50%',
          },
          track: {
            margin: 0,
            background: colors,
            opacity: 0.2,
          },
          dataLabels: {
            show: false
          }
        }
      },
      grid: {
        padding: {
          top: -15,
          bottom: -15
        }
      },
      stroke: {
        lineCap: 'round'
      },
      labels: ['Cricket'],
      colors: colors
    }
    const attributeToMonitor = 'data-theme';

    const observer = new MutationObserver(() => {
      this.reloadCharts();

    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: [attributeToMonitor]
    });
  }

  reloadCharts() {
    // this._processingOrdersChart('["--tb-primary"]');
    // this._deliveringOrdersChart('["--tb-warning"]');
    // this._complatedOrdersChart('["--tb-secondary"]');
    // this._residencypropertyChart('["--tb-success"]');
    //this._propertytypeChart('["--tb-primary", "--tb-secondary", "--tb-light","--tb-danger", "--tb-success"]');
    //this._totalrevenueChart('["--tb-primary"]');
    //this._totalincomeChart('["--tb-success"]');
    //this._orderCountChart('["--tb-danger"]');
    // this._propetryrentChart('["--tb-info"]');
    // this._miniChart6('["--tb-secondary"]');
    // this._miniChart7('["--tb-primary"]');
    // this._miniChart8('["--tb-warning"]');
    // this._miniChart9('["--tb-success"]');
  }

  /**
  * Rent Charts
  */
  private _deliveringOrdersChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.deliveringOrdersChart = {
      series: [this.overviewData.deliveringOfProcessingOrders.progressPercent],
      chart: {
        width: 110,
        height: 110,
        type: 'radialBar',
        sparkline: {
          enabled: true
        }
      },
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 0,
            size: '50%'
          },
          track: {
            margin: 0,
            background: colors,
            opacity: 0.2,
          },
          dataLabels: {
            show: false
          }
        }
      },
      grid: {
        padding: {
          top: -15,
          bottom: -15
        }
      },
      stroke: {
        lineCap: 'round'
      },
      labels: ['Cricket'],
      colors: colors
    }
    // const attributeToMonitor = 'data-theme';

    // const observer = new MutationObserver(() => {
    //   this._rentChart('["--tb-warning"]');
    // });
    // observer.observe(document.documentElement, {
    //   attributes: true,
    //   attributeFilter: [attributeToMonitor]
    // });
  }

  /**
  * visitors Charts
  */
  private _complatedOrdersChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.complatedOrdersChart = {
      series: [this.overviewData.complatedOfDeliveringOrders.progressPercent],
      chart: {
        width: 110,
        height: 110,
        type: 'radialBar',
        sparkline: {
          enabled: true
        }
      },
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 0,
            size: '50%'
          },
          track: {
            margin: 0,
            background: colors,
            opacity: 0.2,
          },
          dataLabels: {
            show: false
          }
        }
      },
      grid: {
        padding: {
          top: -15,
          bottom: -15
        }
      },
      stroke: {
        lineCap: 'round'
      },
      labels: ['Cricket'],
      colors: colors
    }
    // const attributeToMonitor = 'data-theme';

    // const observer = new MutationObserver(() => {
    //   this._visitorsChart('["--tb-secondary"]');
    // });
    // observer.observe(document.documentElement, {
    //   attributes: true,
    //   attributeFilter: [attributeToMonitor]
    // });
  }

  /**
  * Residency Property Charts
  */
  private _residencypropertyChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.orderChart = {
      series: [43],
      chart: {
        width: 110,
        height: 110,
        type: 'radialBar',
        sparkline: {
          enabled: true
        },
        redrawOnParentResize: true
      },
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 0,
            size: '50%'
          },
          track: {
            margin: 0,
            background: colors,
            opacity: 0.2,
          },
          dataLabels: {
            show: false
          }
        }
      },
      grid: {
        padding: {
          top: -15,
          bottom: -15
        }
      },
      stroke: {
        lineCap: 'round'
      },
      labels: ['Cricket'],
      colors: colors
    }
    // const attributeToMonitor = 'data-theme';

    // const observer = new MutationObserver(() => {
    //   this._residencypropertyChart('["--tb-success"]');
    // });
    // observer.observe(document.documentElement, {
    //   attributes: true,
    //   attributeFilter: [attributeToMonitor]
    // });
  }

  /**
  * Property Type Charts
  */
  private _categoryChart(colors: any, data: any) {
    colors = this.getChartColorsArray(colors);
    this.categoryChart = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        bottom: '0%',
        left: 'center',
        // doesn't perfectly work with our tricks, disable it
        selectedMode: false,
        textStyle: {
          color: "#87888a"
        }
      },
      series: [
        {
          type: 'pie',
          radius: ['70%', '100%'],
          center: ['50%', '70%'],
          // adjust the start angle
          startAngle: 180,
          label: {
            color: "#87888a",
            formatter(param: any) {
              // correct the percentage
              return param.name + ' (' + param.percent * 2 + '%)';
            }
          },
          itemStyle: {
            // borderColor: 'transparent',
            borderWidth: 4
          },
          data: data
        }
      ],
      color: colors
    }
  }

  /**
  * Total Revenue Charts
  */
  private _totalrevenueChart(colors: any, data: ChartData[]) {
    colors = this.getChartColorsArray(colors);
    this.totalrevenueChart = {
      series: [{
        name: 'Income',
        data: data
          .sort((a, b) => new Date(`${a.name} 1, 2000`).getMonth() - new Date(`${b.name} 1, 2000`).getMonth())
          .map(x => x.value)
      }],
      chart: {
        type: 'bar',
        height: 328,
        stacked: true,
        toolbar: {
          show: false
        },
      },
      plotOptions: {
        bar: {
          columnWidth: '30%',
          lineCap: 'round',
          borderRadiusOnAllStackedSeries: true
        },
      },
      grid: {
        padding: {
          left: 0,
          right: 0,
          top: -15,
          bottom: -15
        }
      },
      colors: colors,
      fill: {
        opacity: 1
      },
      dataLabels: {
        enabled: false,
        textAnchor: 'top',
      },
      yaxis: {
        labels: {
          show: true,
          formatter: function (y: number) {
            if (y >= 1_000_000_000) return (y / 1_000_000_000).toFixed(1) + "B";
            if (y >= 1_000_000) return (y / 1_000_000).toFixed(1) + "M";
            if (y >= 1_000) return (y / 1_000).toFixed(1) + "K";
            return y.toFixed(0);
          }
        },
      },
      legend: {
        show: false,
        position: 'top',
        horizontalAlign: 'right',
      },
      xaxis: {
        categories: data
          .sort((a, b) => new Date(`${a.name} 1, 2000`).getMonth() - new Date(`${b.name} 1, 2000`).getMonth())
          .map(x => x.name.substring(0, 3)), // 'January' -> 'Jan'
        labels: {
          rotate: -90
        },
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          stroke: {
            width: 1
          },
        },
      }
    }
    // const attributeToMonitor = 'data-theme';

    // const observer = new MutationObserver(() => {
    //   this._totalrevenueChart('["--tb-primary"]');
    // });
    // observer.observe(document.documentElement, {
    //   attributes: true,
    //   attributeFilter: [attributeToMonitor]
    // });
  }

  /**
  * Total Income Charts
  */
  private _totalincomeChart(colors: any, data: ChartData[]) {
    colors = this.getChartColorsArray(colors);
    this.totalincomeChart = {
      series: [{
        name: "Income",
        data: data
          .sort((a, b) => new Date(`${a.name} 1, 2000`).getMonth() - new Date(`${b.name} 1, 2000`).getMonth())
          .map(x => x.value)
      }],
      chart: {
        height: 328,
        type: 'line',
        toolbar: {
          show: false
        },
      },
      grid: {
        yaxis: {
          lines: {
            show: false
          }
        },
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 4
        }
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      colors: colors,
      xaxis: {
        //type: 'datetime',
        categories: data
          .sort((a, b) => new Date(`${a.name} 1, 2000`).getMonth() - new Date(`${b.name} 1, 2000`).getMonth())
          .map(x => x.name.substring(0, 3)), // 'January' -> 'Jan'
      },
      yaxis: {
        labels: {
          show: true,
          formatter: function (y: number) {
            if (y >= 1_000_000_000) return (y / 1_000_000_000).toFixed(1) + "B";
            if (y >= 1_000_000) return (y / 1_000_000).toFixed(1) + "M";
            if (y >= 1_000) return (y / 1_000).toFixed(1) + "K";
            return y.toFixed(0);
          }
        },
      }
    }

    // const attributeToMonitor = 'data-theme';

    // const observer = new MutationObserver(() => {
    //   this._totalincomeChart('["--tb-success"]');
    // });
    // observer.observe(document.documentElement, {
    //   attributes: true,
    //   attributeFilter: [attributeToMonitor]
    // });
  }

  /**
* Property Type Charts
*/
  private _totalOrdersChart(colors: any, data: ChartData[]) {
    colors = this.getChartColorsArray(colors);
    this.totalOrdersChart = {
      series: [{
        name: "Property Rent",
        data: data
          .sort((a, b) => new Date(`${a.name} 1, 2000`).getMonth() - new Date(`${b.name} 1, 2000`).getMonth())
          .map(x => x.value)
      }],
      chart: {
        height: 328,
        type: 'bar',
        toolbar: {
          show: false,
        }
      },
      colors: colors,
      plotOptions: {
        bar: {
          columnWidth: '30%',
          distributed: true,
          borderRadius: 5,
        }
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      },
      xaxis: {
        //type: 'datetime',
        categories: data
          .sort((a, b) => new Date(`${a.name} 1, 2000`).getMonth() - new Date(`${b.name} 1, 2000`).getMonth())
          .map(x => x.name.substring(0, 3)), // 'January' -> 'Jan',
      },
      yaxis: {
        labels: {
          show: true,
          formatter: function (y: number) {
            if (y >= 1_000_000_000) return (y / 1_000_000_000).toFixed(1) + "B";
            if (y >= 1_000_000) return (y / 1_000_000).toFixed(1) + "M";
            if (y >= 1_000) return (y / 1_000).toFixed(1) + "K";
            return y.toFixed(0);
          }
        },
      }
    }

    // const attributeToMonitor = 'data-theme';

    // const observer = new MutationObserver(() => {
    //   this._propertysaleChart('["--tb-danger"]');
    // });
    // observer.observe(document.documentElement, {
    //   attributes: true,
    //   attributeFilter: [attributeToMonitor]
    // });
  }

  /**
* Property Type Charts
*/
  private _propetryrentChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.refundChart = {
      series: [{
        name: 'Property Rent',
        data: [31, 40, 28, 43, 59, 87, 75, 60, 51, 66, 109, 100]
      }],
      chart: {
        height: 328,
        type: 'area',
        toolbar: {
          show: false
        }
      },
      fill: {
        opacity: "0.01",
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 2,
        curve: 'smooth'
      },
      colors: colors,
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        labels: {
          rotate: -90
        },
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          stroke: {
            width: 1
          },
        },
      }
    }

    // const attributeToMonitor = 'data-theme';

    // const observer = new MutationObserver(() => {
    //   this._propetryrentChart('["--tb-info"]');
    // });
    // observer.observe(document.documentElement, {
    //   attributes: true,
    //   attributeFilter: [attributeToMonitor]
    // });
  }

  // mini Chart 6
  private _miniChart6(colors: any, data: ChartData[]) {
    colors = this.getChartColorsArray(colors);
    this.miniChart6 = {
      series: [{
        data: data
          .sort((a, b) => new Date(`${a.name} 1, 2000`).getMonth() - new Date(`${b.name} 1, 2000`).getMonth())
          .map(x => x.value)
      }],
      chart: {
        type: 'line',
        height: 50,
        sparkline: {
          enabled: true
        }

      },
      colors: colors,
      stroke: {
        curve: 'smooth',
        width: 1,
      },
      tooltip: {
        fixed: {
          enabled: false
        },
        x: {
          show: false
        },
        y: {
          title: {
            formatter: function (seriesName: any) {
              return ''
            }
          }
        },
        marker: {
          show: false
        }
      }
    }

    // const attributeToMonitor = 'data-theme';

    // const observer = new MutationObserver(() => {
    //   this._miniChart6('["--tb-secondary"]');
    // });
    // observer.observe(document.documentElement, {
    //   attributes: true,
    //   attributeFilter: [attributeToMonitor]
    // });
  }

  // mini Chart 7
  private _miniChart7(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.miniChart7 = {
      series: [{
        data: [50, 15, 20, 34, 23, 56, 65, 75]
      }],
      chart: {
        type: 'line',
        height: 50,
        sparkline: {
          enabled: true
        }

      },
      colors: colors,
      stroke: {
        curve: 'smooth',
        width: 1,
      },
      tooltip: {
        fixed: {
          enabled: false
        },
        x: {
          show: false
        },
        y: {
          title: {
            formatter: function (seriesName: any) {
              return ''
            }
          }
        },
        marker: {
          show: false
        }
      }
    }

    // const attributeToMonitor = 'data-theme';

    // const observer = new MutationObserver(() => {
    //   this._miniChart7('["--tb-primary"]');
    // });
    // observer.observe(document.documentElement, {
    //   attributes: true,
    //   attributeFilter: [attributeToMonitor]
    // });
  }

  // mini Chart 8
  private _miniChart8(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.miniChart8 = {
      series: [{
        data: [32, 18, 29, 31, 46, 33, 39, 46]
      }],
      chart: {
        type: 'line',
        height: 50,
        sparkline: {
          enabled: true
        }

      },
      colors: colors,
      stroke: {
        curve: 'smooth',
        width: 1,
      },
      tooltip: {
        fixed: {
          enabled: false
        },
        x: {
          show: false
        },
        y: {
          title: {
            formatter: function (seriesName: any) {
              return ''
            }
          }
        },
        marker: {
          show: false
        }
      }
    }

    // const attributeToMonitor = 'data-theme';

    // const observer = new MutationObserver(() => {
    //   this._miniChart8('["--tb-warning"]');
    // });
    // observer.observe(document.documentElement, {
    //   attributes: true,
    //   attributeFilter: [attributeToMonitor]
    // });
  }

  // mini Chart 9
  private _miniChart9(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.miniChart9 = {
      series: [{
        data: [36, 25, 18, 34, 39, 30, 34, 42]
      }],
      chart: {
        type: 'line',
        height: 50,
        sparkline: {
          enabled: true
        }

      },
      colors: colors,
      stroke: {
        curve: 'smooth',
        width: 1,
      },
      tooltip: {
        fixed: {
          enabled: false
        },
        x: {
          show: false
        },
        y: {
          title: {
            formatter: function (seriesName: any) {
              return ''
            }
          }
        },
        marker: {
          show: false
        }
      }
    }

    // const attributeToMonitor = 'data-theme';

    // const observer = new MutationObserver(() => {
    //   this._miniChart9('["--tb-success"]');
    // });
    // observer.observe(document.documentElement, {
    //   attributes: true,
    //   attributeFilter: [attributeToMonitor]
    // });
  }



  // Add Sorting
  direction: any = 'asc';
  sortKey: any = '';
  sortBy(column: any, value: any) {
    this.sortValue = value;
    this.onSort(column)
  }
  
  onSort(column: keyof AdminProductListItemModel) {
    if (this.direction == 'asc') {
      this.direction = 'desc';
    } else {
      this.direction = 'asc';
    }
    const sortedArray = [...this.hotProducts]; // Create a new array
    sortedArray.sort((a, b) => {
      const res = this.compare(a[column], b[column]);
      return this.direction === 'asc' ? res : -res;
    });
    this.hotProducts = sortedArray;
  }
  compare(v1: string | number, v2: string | number) {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }

  chart: any;
  // Render All chart when Change Tab
  renderCharts(charts: any) {
    if (charts === '1') {
      this.chart = new ApexCharts(document.querySelector(".apex-charts"), this.totalrevenueChart);
    } else if (charts === '2') {
      this.chart = new ApexCharts(document.querySelector(".apex-charts"), this.totalincomeChart);
    } else if (charts === '3') {
      this.chart = new ApexCharts(document.querySelector(".apex-charts"), this.totalOrdersChart);
    } else {
      this.chart = new ApexCharts(document.querySelector(".apex-charts"), this.refundChart);
    }
  }
}
