"use client"

import { ChakraProvider } from "@chakra-ui/react"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"
import { dreamPlaceTheme } from "@/design-system/theme"

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={dreamPlaceTheme}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  )
}
