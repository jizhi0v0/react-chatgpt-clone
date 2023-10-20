import React, { useCallback, useContext } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { updateDefaultSettings } from './settings/SettingsReducer';
import { ConversationsContext } from './conversation/ConversationContext';
import Footer from "./Footer";
import {useModels} from "./settings/useModels";

const Settings = ({ isOpen, handleClose }) => {
    const dispatch = useDispatch();
    const { defaultSettings } = useContext(ConversationsContext);

    const handleChange = useCallback(
        (event) => {
            dispatch(
                updateDefaultSettings({
                    defaultModel: event.target.value,
                })
            );
        },
        [dispatch]
    );

    const models = useModels(defaultSettings.apiKey, isOpen);

    if (!isOpen) return null;

    return (
        <div className="fullscreen-modal">
            <div className="title">
                <svg onClick={handleClose} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                     className="bi bi-x"
                     viewBox="0 0 16 16">
                    <path
                        d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                </svg>
            </div>
            <div className="container">
                <div className="left">模型：</div>
                <div className="right">
                    <select defaultValue={defaultSettings.defaultModel} onChange={(event) => handleChange(event)}>
                        {models.map(mode => {
                            return <option key={mode.id}>
                                {mode.id}
                            </option>
                        })}
                    </select>
                </div>
            </div>
            <Footer onClose={handleClose} ></Footer>
        </div>
    );
};

Settings.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
};

export default Settings;
