import { Button } from '../ui';

export function ShareButton({ onClick }) {
    return (
        <div className="wrapped-share" onClick={(e) => e.stopPropagation()}>
            <Button onClick={onClick}>Deel je Wrapped</Button>
        </div>
    );
}
