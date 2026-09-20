import { toast } from 'react-toastify';
import type { ToastOptions } from 'react-toastify';

const base: ToastOptions = { position: 'top-right', autoClose: 3000 };

const notify = {
  success: (msg: string, opts?: ToastOptions) => {
    window.dispatchEvent(new CustomEvent('app:notify', { detail: { type: 'success', message: msg, ts: Date.now() } }));
    return toast.success(msg, { ...base, ...opts });
  },
  error: (msg: string, opts?: ToastOptions) => {
    window.dispatchEvent(new CustomEvent('app:notify', { detail: { type: 'error', message: msg, ts: Date.now() } }));
    return toast.error(msg, { ...base, ...opts });
  },
  info: (msg: string, opts?: ToastOptions) => {
    window.dispatchEvent(new CustomEvent('app:notify', { detail: { type: 'info', message: msg, ts: Date.now() } }));
    return toast.info(msg, { ...base, ...opts });
  },
  warning: (msg: string, opts?: ToastOptions) => {
    window.dispatchEvent(new CustomEvent('app:notify', { detail: { type: 'warning', message: msg, ts: Date.now() } }));
    return toast.warning(msg, { ...base, ...opts });
  },
};

export default notify;


