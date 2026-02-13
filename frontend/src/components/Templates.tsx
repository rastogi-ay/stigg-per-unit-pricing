import { useState, useEffect } from 'react';
import '../styles/App.css';
import '../styles/Template.css';
import { fetchTemplates, createTemplate } from '../api/templates';
import { useMeteredEntitlement, useStiggContext } from '@stigg/react-sdk';

const CUSTOMER_ID = import.meta.env.VITE_STIGG_CUSTOMER_ID;
const TEMPLATES_FEATURE_ID = 'feature-01-templates'; // feature ID from Stigg

export interface Template {
  id: number;
  title: string;
  description: string;
}

function Templates() {
  // Stigg context to get the relevant entitlement information for the templates feature
  const { refreshData } = useStiggContext();
  const { currentUsage, usageLimit } = useMeteredEntitlement({ featureId: TEMPLATES_FEATURE_ID });
  const canCreateTemplate = usageLimit !== undefined && currentUsage < usageLimit;

  const [templates, setTemplates] = useState<Template[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleAdd = async () => {
    if (title.trim()) {
      const newTemplate: Template = {
        id: Date.now(),
        title: title.trim(),
        description: description.trim(),
      };

      try {
        if (canCreateTemplate) {
          // create the template and report the usage to Stigg
          const template = await createTemplate(newTemplate, CUSTOMER_ID, TEMPLATES_FEATURE_ID);
          // refresh the data immediately to update the entitlement status
          await refreshData();
          setTemplates((prev) => [...prev, template]);
          setTitle('');
          setDescription('');
        } else {
          console.error("You don't have access to templates.");
        }
      } catch (error) {
        console.error('Failed to create template:', error);
      }
    }
  };

  useEffect(() => {
    async function load() {
      const list = await fetchTemplates();
      setTemplates(list);
    }
    load();
  }, []);

  return (
    <div className="app">
      <h1>Templates</h1>

      <div className="templates-usage">
        {!canCreateTemplate && (
          <span className="templates-usage__text templates-usage__error">
            You don't have access to templates.
          </span>
        )}
        {usageLimit !== undefined && (
          <>
            <span className="templates-usage__text">
              <strong>{currentUsage}</strong> of <strong>{usageLimit}</strong> templates used (entitlement limit)
            </span>
            <div className="templates-usage__bar">
              <div
                className={`templates-usage__fill ${
                  currentUsage >= usageLimit ? 'templates-usage__fill--at-limit' : ''
                }`}
                style={{
                  width: `${Math.min(100, (currentUsage / usageLimit) * 100)}%`,
                }}
              />
            </div>
          </>
        )}
      </div>

      <div className="input-section">
        <input
          type="text"
          placeholder="Template title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-field"
        />
        <div className="description-wrapper">
          <input
            type="text"
            placeholder="Template description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field"
          />
        </div>
        <button
          onClick={handleAdd}
          className="add-button"
          disabled={!canCreateTemplate}
        >
          Add Template (& report usage to Stigg)
        </button>
      </div>

      <div className="tasks-section">
        {templates.length === 0 ? (
          <p className="empty-message">No templates yet. Add one above!</p>
        ) : (
          <ul className="task-list">
            {templates.map((template) => (
              <li key={template.id} className="template-item">
                <div className="template-content">
                  <h3 className="template-title">{template.title}</h3>
                  {template.description && (
                    <p className="template-description">{template.description}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Templates;
