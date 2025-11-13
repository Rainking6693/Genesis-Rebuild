function createResilientDashboardUI(params: {
  containerId: string;
  data: any[];
  columns: string[];
  rowHeight?: number;
  rowColor?: string;
  columnColor?: string;
  textColor?: string;
  fontSize?: number;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  padding?: number;
  borderRadius?: number;
  isResponsive?: boolean;
  edgeCaseHandlers?: { [key: string]: (data: any) => any };
}): HTMLElement {
  const {
    containerId,
    data,
    columns,
    rowHeight = 50,
    rowColor = '#f5f5f5',
    columnColor = '#e0e0e0',
    textColor = '#333',
    fontSize = 14,
    minWidth = 200,
    maxWidth = 800,
    minHeight = 200,
    maxHeight = 600,
    padding = 10,
    borderRadius = 5,
    isResponsive = false,
    edgeCaseHandlers = {},
  } = params;

  const container = document.createElement('div');
  container.id = containerId;

  const table = document.createElement('table');
  container.appendChild(table);

  const thead = document.createElement('thead');
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  table.appendChild(tbody);

  const headerRow = document.createElement('tr');
  thead.appendChild(headerRow);

  columns.forEach((column) => {
    const th = document.createElement('th');
    th.style.width = `${minWidth}px`;
    th.style.maxWidth = `${maxWidth}px`;
    th.style.height = `${rowHeight}px`;
    th.style.padding = `${padding}px`;
    th.style.borderRadius = `${borderRadius}px`;
    th.style.backgroundColor = columnColor;
    th.style.color = textColor;
    th.style.fontSize = `${fontSize}px`;
    th.textContent = column;
    headerRow.appendChild(th);
  });

  data.forEach((rowData, index) => {
    const tr = document.createElement('tr');
    tbody.appendChild(tr);

    columns.forEach((column) => {
      const td = document.createElement('td');
      td.style.width = `${minWidth}px`;
      td.style.height = `${rowHeight}px`;
      td.style.padding = `${padding}px`;
      td.style.borderRadius = `${borderRadius}px`;
      td.style.backgroundColor = rowColor;
      td.style.color = textColor;
      td.style.fontSize = `${fontSize}px`;

      const dataValue = edgeCaseHandlers[column] ? edgeCaseHandlers[column](rowData[column]) : rowData[column];
      td.textContent = dataValue.toString();

      tr.appendChild(td);
    });

    if (isResponsive && index === data.length - 1) {
      adjustTableSize(container);
    }
  });

  function adjustTableSize(container: HTMLElement) {
    const tableWidth = container.offsetWidth;
    const columnWidths = columns.map((column) => {
      const th = container.querySelector(`th:contains(${column})`);
      return th ? th.offsetWidth : 0;
    });

    const totalColumnWidth = columnWidths.reduce((sum, width) => sum + width, 0);
    const extraSpace = (tableWidth - totalColumnWidth) / columns.length;

    columnWidths.forEach((width, index) => {
      const th = container.querySelector(`th:nth-child(${index + 1})`);
      if (th) {
        th.style.width = `${width + extraSpace}px`;
      }
    });
  }

  return container;
}

function createResilientDashboardUI(params: {
  containerId: string;
  data: any[];
  columns: string[];
  rowHeight?: number;
  rowColor?: string;
  columnColor?: string;
  textColor?: string;
  fontSize?: number;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  padding?: number;
  borderRadius?: number;
  isResponsive?: boolean;
  edgeCaseHandlers?: { [key: string]: (data: any) => any };
}): HTMLElement {
  const {
    containerId,
    data,
    columns,
    rowHeight = 50,
    rowColor = '#f5f5f5',
    columnColor = '#e0e0e0',
    textColor = '#333',
    fontSize = 14,
    minWidth = 200,
    maxWidth = 800,
    minHeight = 200,
    maxHeight = 600,
    padding = 10,
    borderRadius = 5,
    isResponsive = false,
    edgeCaseHandlers = {},
  } = params;

  const container = document.createElement('div');
  container.id = containerId;

  const table = document.createElement('table');
  container.appendChild(table);

  const thead = document.createElement('thead');
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  table.appendChild(tbody);

  const headerRow = document.createElement('tr');
  thead.appendChild(headerRow);

  columns.forEach((column) => {
    const th = document.createElement('th');
    th.style.width = `${minWidth}px`;
    th.style.maxWidth = `${maxWidth}px`;
    th.style.height = `${rowHeight}px`;
    th.style.padding = `${padding}px`;
    th.style.borderRadius = `${borderRadius}px`;
    th.style.backgroundColor = columnColor;
    th.style.color = textColor;
    th.style.fontSize = `${fontSize}px`;
    th.textContent = column;
    headerRow.appendChild(th);
  });

  data.forEach((rowData, index) => {
    const tr = document.createElement('tr');
    tbody.appendChild(tr);

    columns.forEach((column) => {
      const td = document.createElement('td');
      td.style.width = `${minWidth}px`;
      td.style.height = `${rowHeight}px`;
      td.style.padding = `${padding}px`;
      td.style.borderRadius = `${borderRadius}px`;
      td.style.backgroundColor = rowColor;
      td.style.color = textColor;
      td.style.fontSize = `${fontSize}px`;

      const dataValue = edgeCaseHandlers[column] ? edgeCaseHandlers[column](rowData[column]) : rowData[column];
      td.textContent = dataValue.toString();

      tr.appendChild(td);
    });

    if (isResponsive && index === data.length - 1) {
      adjustTableSize(container);
    }
  });

  function adjustTableSize(container: HTMLElement) {
    const tableWidth = container.offsetWidth;
    const columnWidths = columns.map((column) => {
      const th = container.querySelector(`th:contains(${column})`);
      return th ? th.offsetWidth : 0;
    });

    const totalColumnWidth = columnWidths.reduce((sum, width) => sum + width, 0);
    const extraSpace = (tableWidth - totalColumnWidth) / columns.length;

    columnWidths.forEach((width, index) => {
      const th = container.querySelector(`th:nth-child(${index + 1})`);
      if (th) {
        th.style.width = `${width + extraSpace}px`;
      }
    });
  }

  return container;
}