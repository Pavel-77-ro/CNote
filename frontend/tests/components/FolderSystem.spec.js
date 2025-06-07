// tests/components/FolderSystem.spec.js
import { mount, flushPromises } from '@vue/test-utils'
import { vi, describe, it, expect, beforeEach } from 'vitest'


const mockFolders = [
  { _id: 'f1', name: 'Inbox',   parentFolder: null, notes: [] },
  { _id: 'f2', name: 'Projects', parentFolder: null, notes: [
    { _id: 'n1', title: 'Task 1', folderId: 'f2' }
  ] }
]
const mockFolderStore = {
  folders: mockFolders,
  fetchFolders:   vi.fn(() => Promise.resolve()),
  createFolder:   vi.fn(() => Promise.resolve()),
  deleteFolder:   vi.fn(() => Promise.resolve()),
  updateFolder:   vi.fn(() => Promise.resolve()),
  moveFolder:     vi.fn(() => Promise.resolve()),
}

const mockNotes = [
  { _id: 'n2', title: 'Standalone', folderId: null }
]
const mockNoteStore = {
  notes: mockNotes,
  fetchNotes:  vi.fn(() => Promise.resolve()),
  createNote:  vi.fn(() => Promise.resolve()),
  deleteNote:  vi.fn(() => Promise.resolve()),
  updateNote:  vi.fn(() => Promise.resolve()),
  moveNote:    vi.fn(() => Promise.resolve()),
  selectedNote: null,
}

vi.mock('@/stores/folderStore', () => ({
  useFolderStore: () => mockFolderStore
}))

vi.mock('@/stores/noteStore', () => ({
  useNoteStore: () => mockNoteStore
}))

vi.mock('@/stores/userStore', () => ({
  useUserStore: () => ({ logout: vi.fn(), user: { username: 'testuser' } })
}))

vi.mock('@/stores/notificationStore', () => ({
  useNotificationStore: () => ({ showNotification: vi.fn() })
}))

import FolderSystem from '@/components/dashboard/FolderSystem.vue'
import { useFolderStore } from '@/stores/folderStore'
import { useNoteStore   } from '@/stores/noteStore'

describe('FolderSystem.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls fetchFolders & fetchNotes once on mount', () => {
    const folderStore = useFolderStore()
    const noteStore   = useNoteStore()

    mount(FolderSystem, {
      global: { stubs: ['FolderItem','MoveItemPopup','RouterLink'] }
    })

    expect(folderStore.fetchFolders).toHaveBeenCalledTimes(1)
    expect(noteStore.fetchNotes).toHaveBeenCalledTimes(1)
  })

  it('Ctrl+Q triggers createFolder once', async () => {
    const folderStore = useFolderStore()

    mount(FolderSystem, {
      global: { stubs: ['FolderItem','MoveItemPopup','RouterLink'] }
    })

    window.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'q', ctrlKey: true, repeat: false
    }))

    await flushPromises()
    expect(folderStore.createFolder).toHaveBeenCalledTimes(1)
    expect(folderStore.createFolder).toHaveBeenCalledWith({
      name: 'New Folder',
      parentFolder: null
    })
  })

describe('FolderSystem.vue – additional behaviors', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ──────────────────────────────────────────────────────────────────────────────
  // 1️. When FolderItem emits `delete-node` for a folder, deleteFolder() is
  // called and then both fetchFolders() & fetchNotes() run again.
  it('handles folder deletion via FolderItem emit', async () => {
    const folderStore = useFolderStore()
    const noteStore   = useNoteStore()

    const wrapper = mount(FolderSystem, {
      global: { stubs: ['FolderItem','MoveItemPopup','RouterLink'] }
    })

    await wrapper.vm.handleDelete({ type: 'folder', id: 'f1' })

    await flushPromises()

    expect(folderStore.deleteFolder).toHaveBeenCalledWith('f1')
    expect(folderStore.fetchFolders).toHaveBeenCalledTimes(2)
    expect(noteStore.fetchNotes).toHaveBeenCalledTimes(2)
  })

  // ──────────────────────────────────────────────────────────────────────────────
  // 2️.  When FolderItem emits `rename-node` for a note, updateNote() is
  // called and then fetchFolders() runs again.
  it('handles note renaming via FolderItem emit', async () => {
    const folderStore = useFolderStore()
    const noteStore   = useNoteStore()

    const wrapper = mount(FolderSystem, {
      global: { stubs: ['FolderItem','MoveItemPopup','RouterLink'] }
    })

    // Simulate renaming note 'n2' to "New Title"
    await wrapper.vm.handleRename({
      type: 'note',
      node: { _id: 'n2', folderId: null },
      newTitle: 'New Title'
    })

    await flushPromises()

    expect(noteStore.updateNote).toHaveBeenCalledWith('n2', { title: 'New Title' })
    expect(folderStore.fetchFolders).toHaveBeenCalledTimes(2)
  })

  // ──────────────────────────────────────────────────────────────────────────────
  // 3️. Clicking the user‐icon toggles the dropdown pop-up open & closed.
  it('toggles user options popup when clicking user icon', async () => {
    const wrapper = mount(FolderSystem, {
      global: { stubs: ['FolderItem','MoveItemPopup','RouterLink'] }
    })

    // Initially hidden
    expect(wrapper.find('ul').exists()).toBe(false)

    // Click icon to open
    await wrapper.find('.pi-user').trigger('click')
    expect(wrapper.find('ul').exists()).toBe(true)

    // Call the component method to close
    await wrapper.vm.closeOptions()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('ul').exists()).toBe(false)
  })

  // ──────────────────────────────────────────────────────────────────────────────
  // 4️. Calling the component’s onRequestMove() should set moveCandidate
  // and cause <MoveItemPopup> to render (stubbed).
  it('renders MoveItemPopup when onRequestMove is called', async () => {
    const wrapper = mount(FolderSystem, {
      global: { stubs: ['FolderItem','RouterLink','MoveItemPopup'] }
    })

    // Manually invoke the handler as if a child emitted request-move
    await wrapper.vm.onRequestMove({ node: { _id: 'f2' }, siblings: mockFolders, position: 0 })
    await wrapper.vm.$nextTick()

    // MoveItemPopup is stubbed, so we look for its stub tag
    expect(wrapper.find('move-item-popup-stub').exists()).toBe(true)
  })

  // ──────────────────────────────────────────────────────────────────────────────
  // 5. After createNote() resolves, folderStore.fetchFolders() is called a 2nd time.
  it('refetches folders after createNote promise resolves', async () => {
    const folderStore = useFolderStore()
    const noteStore   = useNoteStore()


    noteStore.createNote.mockImplementation(() => Promise.resolve())

    const wrapper = mount(FolderSystem, {
      global: { stubs: ['FolderItem','MoveItemPopup','RouterLink'] }
    })


    const buttons = wrapper.findAll('button')
    await buttons[1].trigger('click')

    await flushPromises()

    expect(folderStore.fetchFolders).toHaveBeenCalledTimes(2)
  })
})

})
