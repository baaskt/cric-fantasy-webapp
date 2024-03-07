import { SvgIconTypeMap } from '@mui/material'
import { OverridableComponent } from '@mui/material/OverridableComponent'

export type SideBarMenuEntity = {
  icon: OverridableComponent<SvgIconTypeMap> & { muiName: string }
  title: string
  path: string
  fullPath: string
  hidden?: boolean
}
