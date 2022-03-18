import ModalComponent from "../../components/Modal"

interface IProps {
    rowId: string;
    isOpen: boolean
    onClose: () => void
}

const ModalView: React.FC<IProps> = ({ rowId, isOpen, onClose }) => {
    console.log(rowId);
    return (
        <ModalComponent
            size="lg"
            title="request details"
            isOpen={isOpen}
            onClose={onClose}>
            Modalview
        </ModalComponent>
    )
}

export default ModalView