import React, { ReactNode, RefObject, useState } from 'react';
import { ComponentPropsWithRef } from 'react';

interface ReportingEngineProps extends ComponentPropsWithRef<typeof MyComponent> {
  reportTitle: string;
  reportData: { [key: string]: string | number }[];
}

const MyComponent = React.forwardRef<RefObject<HTMLDivElement>, ReportingEngineProps>(({ reportTitle, reportData, ...props }, ref) => {
  const [hasData, setHasData] = useState(reportData.length > 0);

  const generateRow = (key: string, value: string | number) => (
    <tr key={key}>
      <td>{key}</td>
      <td>{value}</td>
    </tr>
  );

  return (
    <div ref={ref} {...props}>
      <h2>{reportTitle}</h2>
      <table aria-label="Reporting Engine Data">
        <thead>
          <tr>
            <th aria-label="Key">Key</th>
            <th aria-label="Value">Value</th>
          </tr>
        </thead>
        <tbody>
          {reportData.map((item, index) => {
            const keys = Object.keys(item);
            if (keys.length === 0) return generateRow('Empty', 'Empty');
            const values = Object.values(item);
            if (keys.length !== values.length) return generateRow('Invalid Data', 'Invalid Data');
            return keys.map((key, index) => generateRow(key, values[index] || 'N/A'))[0];
          })}
        </tbody>
        {hasData && <tfoot>
          <tr>
            <td colSpan={2}>
              <span id="report-engine-footer">Reporting Engine</span>
            </td>
          </tr>
        </tfoot>}
      </table>
    </div>
  );
});

export default MyComponent;