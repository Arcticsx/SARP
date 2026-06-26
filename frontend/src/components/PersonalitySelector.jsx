import React, { useState, useEffect } from 'react';
import { api } from '../api';
import './PersonalitySelector.css';

function PersonalitySelector({ onPersonaSelected }) {
  const [personalities, setPersonalities] = useState({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPersonaKey, setEditingPersonaKey] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    system: '',
    scenario: '',
    opening_prompt: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPersonalities();
  }, []);

  const loadPersonalities = async () => {
    setError('');
    setLoading(true);
    try {
      const data = await api.getPersonalities();
      setPersonalities(data);
    } catch (error) {
      console.error('Failed to load personalities:', error);
      setError('Unable to load personas. Confirm the backend is running on localhost:8000.');
      setPersonalities({});
    }
    setLoading(false);
  };

  const handlePersonaClick = (persona) => {
    onPersonaSelected(persona);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const savedPersona = editingPersonaKey
        ? await api.updatePersonality(editingPersonaKey, formData)
        : await api.createPersonality(formData);

      await loadPersonalities();
      setShowCreateForm(false);
      setEditingPersonaKey(null);
      setFormData({ name: '', system: '', scenario: '', opening_prompt: '' });
      onPersonaSelected(savedPersona);
    } catch (error) {
      console.error('Failed to save personality:', error);
      setError(`Failed to save personality: ${error.message}`);
      alert(`Failed to save personality: ${error.message}`);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditPersona = (e, persona) => {
    e.stopPropagation();
    setEditingPersonaKey(persona.key);
    setFormData({
      name: persona.name || '',
      system: persona.system || '',
      scenario: persona.Scenario || '',
      opening_prompt: persona.opening_prompt || ''
    });
    setShowCreateForm(true);
  };

  const handleDeletePersona = async (e, persona) => {
    e.stopPropagation();
    if (!window.confirm(`Delete persona '${persona.name}'?`)) {
      return;
    }

    setLoading(true);
    setError('');
    try {
      await api.deletePersonality(persona.key);
      await loadPersonalities();
    } catch (error) {
      console.error('Failed to delete personality:', error);
      setError(`Failed to delete personality: ${error.message}`);
      alert(`Failed to delete personality: ${error.message}`);
    }
    setLoading(false);
  };

  const handleCancelEdit = () => {
    setShowCreateForm(false);
    setEditingPersonaKey(null);
    setFormData({ name: '', system: '', scenario: '', opening_prompt: '' });
  };

  const personalityList = Object.values(personalities);

  return (
    <div className="personality-selector">
      <h1>SELECT PERSONALITY</h1>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button type="button" className="btn-retry" onClick={loadPersonalities} disabled={loading}>
            Retry
          </button>
        </div>
      )}
      {loading && <p>Loading...</p>}

      {!showCreateForm && (
        <>
          <div className="personality-list">
            {personalityList.length === 0 && !loading && (
              <p>No personalities found. Create one to get started.</p>
            )}

            {personalityList.map((persona) => (
              <div key={persona.key} className="personality-item">
                <div className="persona-info" onClick={() => handlePersonaClick(persona)}>
                  <div className="persona-key">[{persona.key}]</div>
                  <div className="persona-name">{persona.name}</div>
                </div>
                <div className="persona-actions">
                  <button
                    type="button"
                    className="btn-edit"
                    onClick={(e) => handleEditPersona(e, persona)}
                    disabled={loading}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn-delete"
                    onClick={(e) => handleDeletePersona(e, persona)}
                    disabled={loading}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button 
            className="btn-create"
            onClick={() => setShowCreateForm(true)}
          >
            + CREATE NEW PERSONALITY
          </button>
        </>
      )}

      {showCreateForm && (
        <form className="create-form" onSubmit={handleCreateSubmit}>
          <h2>{editingPersonaKey ? 'Edit Personality' : 'Create Personality'}</h2>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>System Prompt:</label>
            <textarea
              name="system"
              value={formData.system}
              onChange={handleInputChange}
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label>Scenario:</label>
            <textarea
              name="scenario"
              value={formData.scenario}
              onChange={handleInputChange}
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label>Opening Prompt:</label>
            <textarea
              name="opening_prompt"
              value={formData.opening_prompt}
              onChange={handleInputChange}
              rows="3"
              required
            />
          </div>

          <div className="form-buttons">
            <button type="submit" disabled={loading}>
              {loading ? (editingPersonaKey ? 'Saving...' : 'Creating...') : (editingPersonaKey ? 'Save' : 'Create')}
            </button>
            <button 
              type="button" 
              onClick={handleCancelEdit}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default PersonalitySelector;
