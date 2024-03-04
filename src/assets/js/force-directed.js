function force_directed_chart(nodes, links) {
  const width = 900;
  const height = 300;

  var color2 = d3.scaleOrdinal(d3.schemeCategory10);

  // Adicionando mais 20 nós
  const nodes2 = [
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
  const links2 = [
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

  const svg = d3
    .select(".force")
    .append("svg")
    .attr("id", "force")
    .attr("width", width)
    .attr("height", height)
    .attr("style", "width: ; height: 400px; font: 10px sans-serif;")
    .call(
      d3.zoom().on("zoom", (event) => {
        svg.attr("transform", event.transform);
      })
    )
    .append("g");

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3.forceLink(links).id((d) => d.id)
    )
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

  const link = svg
    .append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("class", "link");

  const node = svg
    .append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("class", "node")
    .attr("r", 6)
    .attr("fill", (d) => color2(getRandomNumber()))
    //.on("mouseover", highlightNode)
    //.on("mouseout", unhighlightNode);
    .on("mouseover", hideNodes)
    .on("mouseout", showNodes);

  const text = svg
    .append("g")
    .attr("class", "texts")
    .selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .attr("x", (d) => d.x) // Ajuste para corresponder à posição x do círculo
    .attr("y", (d) => d.y + 6 + 3) // Ajuste para corresponder à posição y do círculo + raio + deslocamento
    .append("tspan")
    .text((d) => d.id)
    .attr("fill", "#aaa")
    .attr("font-size", "3px")
    .attr("font-weight", "bold");

  simulation.on("tick", () => {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

    text.attr("x", (d) => d.x).attr("y", (d) => d.y + 9);
  });

  function getRandomNumber() {
    return Math.floor(Math.random() * 7) + 1;
  }

  function hideNodes(d) {
    selectedNode = d3.select(this);
    allNodes = svg.selectAll("circle");

    selectedNodeId = selectedNode.datum().id;

    // Armazenar os IDs dos nós conectados aos links não ocultados
    const connectedNodeIds = new Set([selectedNodeId]);

    const allLinks = svg.selectAll("line");

    // Filtrar os links que não têm o nó selecionado como source ou target
    const filteredLinks = allLinks.filter(
      (d) => d.source.id === selectedNodeId || d.target.id === selectedNodeId
    );

    // Adicionar os IDs dos nós conectados ao conjunto
    filteredLinks.each(function (d) {
      connectedNodeIds.add(d.source.id);
      connectedNodeIds.add(d.target.id);
    });

    // Ocultar os nós que não estão conectados aos links filtrados
    const otherNodes = allNodes.filter((d) => !connectedNodeIds.has(d.id));
    otherNodes.classed("hide", true);

    // Ocultar os links que não estão conectados ao nó selecionado
    const linksToHide = allLinks.filter(
      (d) => d.source.id !== selectedNodeId && d.target.id !== selectedNodeId
    );
    linksToHide.classed("hide", true);
  }

  function showNodes(d) {
    allNodes = svg.selectAll("circle");
    allNodes.classed("hide", false);

    allLinks = svg.selectAll("line");
    allLinks.classed("hide", false);
  }

  // Add a drag behavior.
  node.call(
    d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended)
  );

  // Set the position attributes of links and nodes each time the simulation ticks.
  function ticked() {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
  }

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

  return svg;
}

function filterNodes(data) {
  const svg = d3.select("#force");

  // Select a specific node by its 'id' attribute
  const specificNode = svg.selectAll("circle").filter((d) => d.id === data);

  specificNode.each(function (d) {
    selectedNodeId = d.id;
  });

  allNodes = svg.selectAll("circle");

  selectedNodeId = specificNode.datum().id;

  // Armazenar os IDs dos nós conectados aos links não ocultados
  const connectedNodeIds = new Set([selectedNodeId]);

  const allLinks = svg.selectAll("line");

  // Filtrar os links que não têm o nó selecionado como source ou target
  const filteredLinks = allLinks.filter(
    (d) => d.source.id === selectedNodeId || d.target.id === selectedNodeId
  );

  // Adicionar os IDs dos nós conectados ao conjunto
  filteredLinks.each(function (d) {
    connectedNodeIds.add(d.source.id);
    connectedNodeIds.add(d.target.id);
  });

  // Ocultar os nós que não estão conectados aos links filtrados
  const otherNodes = allNodes.filter((d) => !connectedNodeIds.has(d.id));
  otherNodes.classed("hide", true);

  // Ocultar os links que não estão conectados ao nó selecionado
  const linksToHide = allLinks.filter(
    (d) => d.source.id !== selectedNodeId && d.target.id !== selectedNodeId
  );
  linksToHide.classed("hide", true);
}

function showFilterNodes(data) {
  const svg = d3.select("#force");
  allNodes = svg.selectAll("circle");
  allNodes.classed("hide", false);

  allLinks = svg.selectAll("line");
  allLinks.classed("hide", false);
}
