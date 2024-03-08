import { SvgIconTypeMap } from '@mui/material'
import { OverridableComponent } from '@mui/material/OverridableComponent'
export type CricMenuEntity = {
  icon: OverridableComponent<SvgIconTypeMap> & { muiName: string }
  label: string
  value: string
}
