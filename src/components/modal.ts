import NiceModal, { useModal as useNiceModal } from '@ebay/nice-modal-react';
import { MODAL_ANIMATE_OUT_TIME } from './Modal';

export type ModalDefinition<TProps = any, TValue = any> = {
    _props: TProps,
    _value: TValue
}
export type ExtractModalProps<TModal extends ModalDefinition> = TModal extends ModalDefinition<infer TProps> ? TProps : never;
export type ExtractModalValue<TModal extends ModalDefinition> = TModal extends ModalDefinition<any, infer TValue> ? TValue : never;

type ModalController<TValue> = {
    resolve(value: TValue): void
}
type ModalComponent<TModal extends ModalDefinition>
    = (props: ExtractModalProps<TModal> & { modal: ModalController<ExtractModalValue<TModal>> })
        => React.ReactElement;

const map = new Map<ModalDefinition, any>();
function createModal<TProps, TValue>(component: ModalComponent<ModalDefinition<TProps, TValue>>): ModalDefinition<TProps, TValue> {
    const modal: any = NiceModal.create((props) => {
        const modal = useNiceModal();

        return component({
            ...(props as TProps),
            modal: {
                resolve(value) {
                    modal.resolve(value);
                    modal.hide();
                    setTimeout(() => {
                        modal.remove();
                    }, MODAL_ANIMATE_OUT_TIME);
                },
            }
        });
    });

    const definition: any = {};
    map.set(definition, modal);
    return definition;
}

type PropsOptionalIfVoid<TModal extends ModalDefinition, TProps> = TProps extends void ? [TModal] : [TModal, TProps];
function open<TModal extends ModalDefinition>(...args: PropsOptionalIfVoid<TModal, ExtractModalProps<TModal>>): Promise<ExtractModalValue<TModal>>;
function open(definition: any, props: any = {}) {
    const modal = map.get(definition);
    return NiceModal.show(modal, props);
}

export const Modals = {
    createModal,
    open
};