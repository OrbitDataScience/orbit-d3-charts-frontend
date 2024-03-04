function disjoint_force_directed() {
  const dataNodes = [
    { id: "Óculos de Sol" },
    { id: "IPhone" },
    { id: "Celular" },
    { id: "Viagem" },
    { id: "Videogame" },
    { id: "PS5" },
    { id: "Controle" },
    // Novos nós
    { id: "Notebook" },
    { id: "Fone de Ouvido" },
    { id: "Relógio" },
    { id: "Livro" },
    { id: "Café" },
    { id: "Pizza" },
    { id: "Bicicleta" },
    { id: "Mochila" },
    { id: "Câmera" },
    { id: "Guitarra" },
    { id: "Tênis" },
    { id: "Camiseta" },
    { id: "Chapéu" },
  ];

  // Adicionando mais 20 links
  const dataLinks = [
    { source: "Óculos de Sol", target: "IPhone" },
    { source: "IPhone", target: "Celular" },
    { source: "Celular", target: "Viagem" },
    { source: "Viagem", target: "Óculos de Sol" },
    { source: "Videogame", target: "Óculos de Sol" },
    { source: "Videogame", target: "IPhone" },
    { source: "PS5", target: "Videogame" },
    { source: "Controle", target: "Óculos de Sol" },
    // Novos links
    { source: "Notebook", target: "Fone de Ouvido" },
    { source: "Fone de Ouvido", target: "Celular" },
    { source: "Relógio", target: "Celular" },
    { source: "Livro", target: "Café" },
    { source: "Pizza", target: "Café" },
    { source: "Bicicleta", target: "Tênis" },
    { source: "Mochila", target: "Notebook" },
    { source: "Câmera", target: "Viagem" },
    { source: "Guitarra", target: "Fone de Ouvido" },
    { source: "Tênis", target: "Camiseta" },
    { source: "Camiseta", target: "Chapéu" },
    { source: "Chapéu", target: "Óculos de Sol" },
    { source: "Controle", target: "PS5" },
    { source: "PS5", target: "Fone de Ouvido" },
    { source: "Videogame", target: "Controle" },
    { source: "IPhone", target: "Fone de Ouvido" },
    { source: "Notebook", target: "Mochila" },
    { source: "Relógio", target: "Tênis" },
    { source: "Guitarra", target: "Livro" },
    { source: "Câmera", target: "Mochila" },
    { source: "Notebook", target: "Pizza" },
    { source: "Fone de Ouvido", target: "Bicicleta" },
    { source: "Relógio", target: "Guitarra" },
    { source: "Livro", target: "PS5" },
    { source: "Café", target: "Câmera" },
    { source: "Pizza", target: "Controle" },
    { source: "Bicicleta", target: "IPhone" },
    { source: "Mochila", target: "Videogame" },
    { source: "Câmera", target: "Chapéu" },
    { source: "Guitarra", target: "Celular" },
    { source: "Tênis", target: "Óculos de Sol" },
    { source: "Camiseta", target: "Notebook" },
    { source: "Chapéu", target: "Relógio" },
    { source: "Óculos de Sol", target: "Livro" },
    { source: "Controle", target: "Café" },
    { source: "PS5", target: "Pizza" },
    { source: "Videogame", target: "Bicicleta" },
    { source: "IPhone", target: "Mochila" },
    { source: "Celular", target: "Câmera" },
    { source: "Viagem", target: "Guitarra" },
  ];

  // Specify the dimensions of the chart.
  const width = 928;
  const height = 680;

  // Specify the color scale.
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  // The force simulation mutates links and nodes, so create a copy
  // so that re-evaluating this cell produces the same result.
  const links = dataLinks.map(d => ({...d}));
  const nodes = dataNodes.map(d => ({...d}));

  // Create a simulation with several forces.
  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3.forceLink(links).id((d) => d.id)
    )
    .force("charge", d3.forceManyBody())
    .force("x", d3.forceX())
    .force("y", d3.forceY());

  // Create the SVG container.
  const svg = d3
    .select(".force")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .attr("style", "max-width: 100%; height: auto;");

  // Add a line for each link, and a circle for each node.
  const link = svg
    .append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke-width", (d) => Math.sqrt(d.value));

  const node = svg
    .append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("r", 5)
    .attr("fill", (d) => color(d.group));

  node.append("title").text((d) => d.id);

  // Add a drag behavior.
  node.call(
    d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended)
  );

  // Set the position attributes of links and nodes each time the simulation ticks.
  simulation.on("tick", () => {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
  });

  // Reheat the simulation when drag starts, and fix the subject position.
  function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  // Update the subject (dragged node) position during drag.
  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  // Restore the target alpha so the simulation cools after dragging ends.
  // Unfix the subject position now that it’s no longer being dragged.
  function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

  // When this cell is re-run, stop the previous simulation. (This doesn’t
  // really matter since the target alpha is zero and the simulation will
  // stop naturally, but it’s a good practice.)
  invalidation.then(() => simulation.stop());
}
