function circlesChart(data) {  
  // Specify the dimensions of the chart.
  const width = 500;
  const height = width;
  const margin = 1; // to avoid clipping the root circle stroke

  // Specify the number format for values.
  const format = d3.format(",d");

  // Create the pack layout.
  const pack = d3
    .pack()
    .size([width - margin * 2, height - margin * 2])
    .padding(10);

  // Compute the hierarchy from the JSON data; recursively sum the
  // values for each node; sort the tree by descending value; lastly
  // apply the pack layout.
  const root = pack(
    d3
      .hierarchy(data)
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value)
  );

  const zoom = d3
    .zoom()
    .scaleExtent([1, 5])
    .on("zoom", (event) => {
      nodesGroup.attr("transform", event.transform);
    });

  // Create the SVG container.
  const svg = d3
    .select(".circles")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-margin, -margin, width, height])
    .attr("style", "width: 100%; height: 750px; font: 10px sans-serif;")
    .attr("text-anchor", "middle")
    .attr("id","circles-chart")

  var nodesGroup = svg.append("g");

  // Place each node according to the layout’s x and y values.
  const node = nodesGroup
    .selectAll()
    .data(root.descendants())
    .join("g")
    .attr("transform", (d) => `translate(${d.x},${d.y})`);

  nodesGroup.call(zoom);
  // Add a title.
  node.append("title").text(
    (d) =>
      `${d
        .ancestors()
        .map((d) => d.data.name)
        .reverse()
        .join("/")}\n${format(d.value)}`
  );

  // Add a filled or stroked circle.
  node
    .append("circle")
    //.attr("fill", (d) => (d.children ? "#fff" : "#ddd"))
    .attr("fill", (d) =>
      d.depth === 0 && d.data.name === "Produtos"
        ? "none"
        : d.children
        ? ((d.data.color = returnRandomColor()), d.data.color)
        : adjustTone(d.parent?.data.color, d.depth)
    )
    .attr("stroke", (d) => (d.depth != 0 ? "#fff" : ""))
    .style("stroke-width", "1px")
    .style("stroke-opacity", "0.5")
    //.attr("stroke", (d) => (d.children ? "#bbb" : null))
    .attr("r", (d) => d.r);

  // Add a label to leaf nodes.
  const text = node
    .filter((d) => !d.children)
    .append("text")
    .attr("clip-path", (d) => `circle(${d.r})`)
    .attr("fill", "#1C1C1C")
    .style("font-size", (d) => `${d.r / 3}px`)
    .style("font-family", "'Segoe UI'")
    .style("font-weight", "bold")
    .style("color", "#999");

  // Add a tspan for each CamelCase-separated word.
  text
    .selectAll()
    .data((d) => d.data.name.split(/(?=[A-Z][a-z])|\s+/g))
    .join("tspan")
    .attr("x", 0)
    .attr("y", (d, i, nodes) => `${i - nodes.length / 2 + 0.6}em`)
    .text((d) => d);

  // Primeiro, criar caminhos invisíveis para o texto seguir
  node
    .filter((d) => d.children != null)
    .append("path")
    .attr("id", (d, i) => `label-path-${i}`)
    .style("fill", "none")
    .style("stroke", "none")
    .attr("d", (d) => {
      // Este cria um caminho circular usando a sintaxe de arco SVG
      // O arco é desenhado para a parte superior interna do círculo
      const x = d.r - 0.1;
      const y = 0;
      // Inverter a direção do arco para que o texto siga pelo lado interno
      // Ajustar os flags de sweep e large-arc para desenhar o arco na direção correta
      const upperInnerArc = `M ${-x},${y} A ${d.r},${d.r} 0 0,1 ${x},${y}`;
      return upperInnerArc;
    });

  // Em seguida, anexar seu texto e usar o elemento 'textPath' para vincular o texto ao caminho
  const categoriesText = node
    .filter((d) => d.children != null)
    .append("text")
    .style("font-size", (d) => `${d.r / 6}px`)
    .attr("fill", "#fff")
    // Anexar um elemento textPath
    .append("textPath")
    // Vincular elemento textPath ao caminho pelo ID
    .attr("xlink:href", (d, i) => `#label-path-${i}`)
    .attr("startOffset", "50%") // Você pode ajustar isso para mudar onde o texto começa no caminho
    .text((d) => d.data.name)
    .attr("text-anchor", "middle") // Centralizar o texto no caminho
    .style("dominant-baseline", "hanging") // Garantir que o texto fique na parte de cima
    .style("pointer-events", "none") // Adicionado para evitar a sobreposição
    .style("font-weight", "bold");

  categoriesText.filter((d) => d.depth == 0).text("");

  return svg.node();
}

function returnRandomColor() {
  var colorList = [
    "#1E90FF",
    "#20B2AA",
    "#2E8B57",
    "#EE82EE",
    "#FE6244",
    "#FFB84C",
    "#BC7AF9",
    "#82CD47",
    "#96BAFF",
  ];

  let randomNumber = Math.floor(Math.random() * 9);

  return colorList[randomNumber];
}

function adjustTone(color, depth) {
  var colorObj = d3.color(color);
  // Evita que d3,color retorne nulo
  if (colorObj)
    // Ajuste a tonalidade com base na profundidade (mais claro ou mais escuro)
    return colorObj.brighter(depth * 0.5);
  // Ajuste o multiplicador conforme necessário
  else return color;
}
