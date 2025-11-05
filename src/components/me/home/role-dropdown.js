'use client'

import { Combobox, InputBase, Text, useCombobox } from '@mantine/core'
import { IconAt } from '@tabler/icons-react'
import { useMemo, useState } from 'react'

import { intToHex } from '@/lib/functions/utils'

export default function RoleDropdown({
  error,
  excludeEveryone = true,
  initialId,
  label = 'Role',
  noneAsOption = false,
  placeholder = 'Select role',
  roles,
  setRole
}) {
  const combobox = useCombobox()
  const [search, setSearch] = useState(roles.find((c) => c.id === initialId)?.name || '')

  const roleComponents = useMemo(() => {
    const mappedRoles = roles
      .filter((r) => excludeEveryone && r.name !== '@everyone')
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((r) => ({
        component: <Text c={intToHex(r.color)}>@{r.name}</Text>,
        id: r.id,
        name: r.name
      }))

    if (noneAsOption)
      mappedRoles.unshift({
        component: <Text>None</Text>,
        id: 'none',
        name: ''
      })

    return mappedRoles
  }, [excludeEveryone, noneAsOption, roles])

  const filteredOptions = roleComponents.filter((c) => c.name.includes(search.toLowerCase().trim()))

  const options = filteredOptions.map((c) => (
    <Combobox.Option key={c.id} value={c.id}>
      {c.component}
    </Combobox.Option>
  ))

  const handleOptionSelect = (id) => {
    setSearch(roleComponents.find((c) => c.id === id).name)
    setRole(id)
  }

  return (
    <Combobox
      label={label}
      middlewares={{ flip: false }}
      onOptionSubmit={(val) => {
        combobox.closeDropdown()
        handleOptionSelect(val)
      }}
      store={combobox}
      style={{ maxWidth: '16rem' }}
    >
      <Combobox.Target>
        <InputBase
          error={error}
          leftSection={<IconAt />}
          leftSectionPointerEvents='none'
          onBlur={() => {
            combobox.closeDropdown()
            const revertedRole = roles.find((c) => c.id === initialId)
            setSearch(revertedRole?.name || '')
            setRole(revertedRole?.id)
          }}
          onChange={(event) => {
            combobox.updateSelectedOptionIndex()
            setSearch(event.currentTarget.value)
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => {
            setSearch('')
            combobox.openDropdown()
          }}
          placeholder={placeholder}
          rightSection={<Combobox.Chevron />}
          rightSectionPointerEvents='none'
          size='md'
          value={search}
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options mah={200} style={{ overflowY: 'auto' }}>
          {options.length > 0 ? options : <Combobox.Empty c='gray.1'>Nothing found</Combobox.Empty>}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  )
}
