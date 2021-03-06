import * as React from 'react';
import { mount } from 'enzyme';
import { PluginHost } from '@devexpress/dx-react-core';
import {
  pointAttributes, findSeriesByName, xyScales, coordinates,
} from '@devexpress/dx-chart-core';
import { pluginDepsToComponents } from '@devexpress/dx-react-core/test-utils';
import { ScatterSeries } from './scatter-series';
import { PointCollection } from '../templates/series/point-collection';

const PointComponent = () => null;

const coords = [
  { x: 1, y: 11, id: 1 },
  { x: 2, y: 12, id: 2 },
  { x: 3, y: 13, id: 3 },
  { x: 4, y: 14, id: 4 },
  { x: 5, y: 15, id: 5 },
];

jest.mock('@devexpress/dx-chart-core', () => ({
  pointAttributes: jest.fn(),
  findSeriesByName: jest.fn(),
  xyScales: jest.fn(),
  coordinates: jest.fn(),
  seriesData: jest.fn(),
  checkZeroStart: jest.fn(),
}));

pointAttributes.mockImplementation(() => () => ({
  x: 4,
  y: 3,
  d: 'M12 12',
}));

findSeriesByName.mockImplementation(() => ({
  axisName: 'axisName',
  argumentField: 'arg',
  valueField: 'val',
  stack: 'stack',
}));

xyScales.mockImplementation();
coordinates.mockImplementation(() => coords);

describe('Scatter series', () => {
  const defaultDeps = {
    getter: {
      layouts: { pane: {} },
      domains: {},
      colorDomain: jest.fn(),
    },
    template: {
      series: {},
    },
  };

  const defaultProps = {
    seriesComponent: PointCollection,
    pointComponent: PointComponent,
    name: 'val1',
    styles: 'styles',
    valueField: 'valueField',
    argumentField: 'argumentField',
    axisName: 'axisName',
    point: { size: 5 },
    uniqueName: 'uniqueSeriesName',
  };

  it('should render points', () => {
    const tree = mount((
      <PluginHost>
        {pluginDepsToComponents(defaultDeps)}

        <ScatterSeries
          {...defaultProps}
        />
      </PluginHost>));

    expect(tree.find(PointComponent)).toHaveLength(coords.length);

    coords.forEach((coord, index) => {
      const {
        d, x, y, styles,
      } = tree.find(PointComponent).get(index).props;
      expect(d).toBe('M12 12');
      expect(x).toBe(index + 1);
      expect(y).toBe(index + 11);
      expect(styles).toBe('styles');
    });
  });
});
