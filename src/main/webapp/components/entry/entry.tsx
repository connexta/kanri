import main from '../../main'
import { ExtensionType } from '../app-root/app-root.pure'

export const entry = ({ extension }: { extension: ExtensionType }) => {
  main({ extension })
}
