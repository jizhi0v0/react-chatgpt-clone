import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

function Footer({ onClose }) {
    return (
        <div className="footer">
            <Button as="input" onClick={onClose} type="button" value="CANCEL" />{' '}
            <Button as="input" onClick={onClose} type="button" value="SAVE" />{' '}
        </div>
    );
}

Footer.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export default Footer;
