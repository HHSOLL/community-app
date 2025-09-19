import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { ChecklistPreview } from '../ChecklistPreview';

function createTestI18n() {
  const instance = i18n.createInstance();
  instance.use(initReactI18next);
  instance.init({
    lng: 'ko',
    resources: {
      ko: {
        translation: {
          checklist: {
            title: '체크리스트 생성기',
            description: '설명'
          }
        }
      }
    }
  });
  return instance;
}

describe('ChecklistPreview', () => {
  it('renders checklist title and sample items', () => {
    const testI18n = createTestI18n();

    render(
      <I18nextProvider i18n={testI18n}>
        <ChecklistPreview />
      </I18nextProvider>
    );

    expect(screen.getByText('체크리스트 생성기')).toBeInTheDocument();
    expect(screen.getByText('통신 개통')).toBeInTheDocument();
  });
});
