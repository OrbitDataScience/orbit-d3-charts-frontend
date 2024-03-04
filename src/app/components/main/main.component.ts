import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { Productnode } from 'src/app/interfaces/productnode';
import { MainService } from 'src/app/services/main.service';

//Variáveis para chamar as funções dos gráficos que estão em assets/js
declare var circlesChart: any;
declare var radial_cluster_chart: any;
declare var cluster_tree: any
declare var force_directed_chart: any
declare var disjoint_force_directed: any
declare var filterNodes: any
declare var showFilterNodes: any


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})



export class MainComponent implements OnInit {

  constructor(private renderer: Renderer2, private el: ElementRef, private mainService: MainService) { }

  chartData: Productnode = {
    name: '',
    children: [],
    value: 0
  }

  childrenList: any

  selectedCategory = '0'

  selectedChartType = 0

  dataNodes: any


  ngOnInit(): void {
    //Inicializa o gráfico de bolhas
    this.mainService.getCirclesChartData().subscribe({
      next: (r: any) => {
        this.chartData = r
        this.childrenList = r.children
        new circlesChart(r)
      }
      , error: (e) => { console.log(e) }
    })

    //Incializa o gráfico de nós
    this.mainService.getNodesChartData().subscribe(
      {
        next: (r) => {
          this.dataNodes = r.nodes
          new force_directed_chart(r.nodes, r.links)

        }
        , error: (e) => { console.log(e) }
      }
    )

  }

  //Filtra os dados exibidos nos gráficos de categorias
  public filterChart() {
    //apaga os gráficos antigos
    this.deleteSvgElement("radial-chart")
    this.deleteSvgElement("circles-chart")
    this.deleteSvgElement("cluster-tree-chart")

    let filteredData: any
    let data: Productnode

    //todas as categorias
    if (this.selectedCategory == '0') {
      // new circlesChart(this.chartData)
      // new radial_cluster_chart(this.chartData)
      data = this.chartData
    }
    else {
      //filtra a categoria conforme a que foi escolhida no select 
      filteredData = this.chartData.children?.filter(item => item.name == this.selectedCategory)
      data = filteredData[0]
      //adiciona os novos gráficos filtrados
      // new radial_cluster_chart(filteredData[0])
      // new circlesChart(filteredData[0])

    }
    this.changeChartType(data)
  }

  //Muda o gráfico exibido na tela
  changeChartType(data: Productnode) {
    if (this.selectedChartType == 0)
      new circlesChart(data)
    else if (this.selectedChartType == 1)
      new radial_cluster_chart(data)
    else
      new cluster_tree(data)

  }

  //Apaga os gráficos na tela
  deleteSvgElement(elementId: string): void {
    const svgElement = this.el.nativeElement.querySelector(`#${elementId}`);
    if (svgElement && svgElement.parentNode) {
      this.renderer.removeChild(svgElement.parentNode, svgElement);
    }


  }


  public forceLegend(data: any) {
    new filterNodes(data)
  }

  public showNodes() {
    new showFilterNodes
  }

}


