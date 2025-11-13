import React, { useState } from 'react';
import { I18n } from 'react-i18next';
import { useTranslation } from 'react-i18next';

interface ColumnDefinition {
  id: string;
  title: string;
}

interface Props {
  reportTitle?: string;
  reportData?: (string | number)[][];
  columnDefinitions?: ColumnDefinition[];
  defaultColumnDefinitions?: ColumnDefinition[];
}

const ReportingEngine: React.FC<Props> = ({
  reportTitle,
  reportData,
  columnDefinitions = [],
  defaultColumnDefinitions = [
    { id: 'column1', title: 'Column 1' },
    { id: 'column2', title: 'Column 2' },
  ],
}) => {
  const { t } = useTranslation();
  const [columns, setColumns] = useState<ColumnDefinition[]>(columnDefinitions || defaultColumnDefinitions);

  const getColumnById = (columnId: string) => columns.find((column) => column.id === columnId);

  const handleColumnDefinitionChange = (newColumnDefinitions: ColumnDefinition[]) => {
    setColumns(newColumnDefinitions);
  };

  return (
    <I18n>
      {(t, { i18n }) => (
        <div>
          <h1>{t(reportTitle || 'defaultReportTitle')}</h1>
          <table>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.id}>{t(column.title)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reportData?.map((row, index) => (
                <tr key={index}>
                  {row.map((cell, cellIndex) => (
                    <td key={`${index}-${cellIndex}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {/* Added a callback function to allow for dynamic column definition changes */}
          {columnDefinitions.length === 0 && (
            <button onClick={() => handleColumnDefinitionChange(defaultColumnDefinitions)}>
              Reset Column Definitions
            </button>
          )}
        </div>
      )}
    </I18n>
  );
};

export default ReportingEngine;

import React, { useState } from 'react';
import { I18n } from 'react-i18next';
import { useTranslation } from 'react-i18next';

interface ColumnDefinition {
  id: string;
  title: string;
}

interface Props {
  reportTitle?: string;
  reportData?: (string | number)[][];
  columnDefinitions?: ColumnDefinition[];
  defaultColumnDefinitions?: ColumnDefinition[];
}

const ReportingEngine: React.FC<Props> = ({
  reportTitle,
  reportData,
  columnDefinitions = [],
  defaultColumnDefinitions = [
    { id: 'column1', title: 'Column 1' },
    { id: 'column2', title: 'Column 2' },
  ],
}) => {
  const { t } = useTranslation();
  const [columns, setColumns] = useState<ColumnDefinition[]>(columnDefinitions || defaultColumnDefinitions);

  const getColumnById = (columnId: string) => columns.find((column) => column.id === columnId);

  const handleColumnDefinitionChange = (newColumnDefinitions: ColumnDefinition[]) => {
    setColumns(newColumnDefinitions);
  };

  return (
    <I18n>
      {(t, { i18n }) => (
        <div>
          <h1>{t(reportTitle || 'defaultReportTitle')}</h1>
          <table>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.id}>{t(column.title)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reportData?.map((row, index) => (
                <tr key={index}>
                  {row.map((cell, cellIndex) => (
                    <td key={`${index}-${cellIndex}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {/* Added a callback function to allow for dynamic column definition changes */}
          {columnDefinitions.length === 0 && (
            <button onClick={() => handleColumnDefinitionChange(defaultColumnDefinitions)}>
              Reset Column Definitions
            </button>
          )}
        </div>
      )}
    </I18n>
  );
};

export default ReportingEngine;