export type RadioboxProps = {
  id: string;
  name: string;
  onChange: () => void;
  title: string;
  checked?: boolean;
  defaultChecked?: boolean;
};
