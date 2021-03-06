import * as React from 'react';
import { mount } from 'enzyme';
import { pluginDepsToComponents, getComputedState } from '@devexpress/dx-react-core/test-utils';
import { PluginHost, Template } from '@devexpress/dx-react-core';
import { appointments } from '@devexpress/dx-scheduler-core';
import { SchedulerCore } from './scheduler-core';

const defaultProps = {
  data: [1, 2, 3],
  rootComponent: () => null,
  getTitle: () => 'a',
  getEndDate: () => '2018-07-05',
  getStartDate: () => '2018-07-06',
  getAllDay: () => undefined,
};

jest.mock('@devexpress/dx-scheduler-core', () => ({
  appointments: jest.fn(),
}));

describe('Scheduler Core', () => {
  beforeEach(() => {
    appointments.mockImplementation(() => [
      { start: '2018-07-24', end: '2018-07-25' },
    ]);
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should provide the "getAppointmentTitle" getter', () => {
    const tree = mount((
      <PluginHost>
        <SchedulerCore
          {...defaultProps}
          getTitle={() => 'a'}
        />
        {pluginDepsToComponents({})}
      </PluginHost>
    ));

    expect(getComputedState(tree).getAppointmentTitle())
      .toBe('a');
  });

  it('should provide the "getAppointmentStartDate" getter', () => {
    const tree = mount((
      <PluginHost>
        <SchedulerCore
          {...defaultProps}
          getStartDate={() => '2018-07-05'}
        />
        {pluginDepsToComponents({})}
      </PluginHost>
    ));

    expect(getComputedState(tree).getAppointmentStartDate())
      .toBe('2018-07-05');
  });

  it('should provide the "getAppointmentEndDate" getter', () => {
    const tree = mount((
      <PluginHost>
        <SchedulerCore
          {...defaultProps}
          getEndDate={() => '2018-07-05'}
        />
        {pluginDepsToComponents({})}
      </PluginHost>
    ));

    expect(getComputedState(tree).getAppointmentEndDate())
      .toBe('2018-07-05');
  });

  it('should provide the "appointment" getter', () => {
    const tree = mount((
      <PluginHost>
        <SchedulerCore
          {...defaultProps}
        />
        {pluginDepsToComponents({})}
      </PluginHost>
    ));

    expect(getComputedState(tree).appointments)
      .toEqual([
        { start: '2018-07-24', end: '2018-07-25' },
      ]);
  });

  it('should render root template', () => {
    const tree = mount((
      <PluginHost>
        <SchedulerCore
          {...defaultProps}
          rootComponent={({ children }) => (
            <div className="root">
              {children}
            </div>
          )}
        />
        <Template name="header">
          <div className="header-content" />
        </Template>
        <Template name="body">
          <div className="body-content" />
        </Template>
        <Template name="footer">
          <div className="footer-content" />
        </Template>
      </PluginHost>
    ));

    const root = tree.find('.root');
    expect(root.exists()).toBeTruthy();
    expect(root.children().at(0).find('.header-content').exists()).toBeTruthy();
    expect(root.children().at(1).find('.body-content').exists()).toBeTruthy();
    expect(root.children().at(2).find('.footer-content').exists()).toBeTruthy();
  });
});
