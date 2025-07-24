import { Section } from '@/components/ui/Section'
import { Card } from '@/components/ui/cards/Card'
import { TabsWithStore } from '@/components/ui/TabsWithStore'
import { useToasts, useUIStore } from '@/store/uiStore'
import { StandardButton } from '@/components/ui/buttons/StandardButton'
import { SaveButton } from '@/components/ui/buttons/SaveButton'

/**
 * Demo component to showcase UI components with Zustand integration
 */
export const UIComponentsDemo = () => {
  const { addToast } = useToasts()
  const { theme, setTheme } = useUIStore(state => ({
    theme: state.theme,
    setTheme: state.setTheme
  }))
  
  // Demo function to add a toast
  const showToast = (type: 'info' | 'success' | 'warning' | 'error') => {
    const titles = {
      info: 'Information',
      success: 'Success!',
      warning: 'Warning',
      error: 'Error'
    }
    
    const messages = {
      info: 'This is an informational message.',
      success: 'Operation completed successfully!',
      warning: 'Please be cautious with this action.',
      error: 'Something went wrong. Please try again.'
    }
    
    addToast({
      type,
      title: titles[type],
      message: messages[type],
      duration: 5000,
      dismissible: true
    })
  }
  
  // Content for tabs
  const tabContents = {
    features: (
      <div className="p-4 space-y-4">
        <h3 className="text-lg font-medium">Key Features</h3>
        <ul className="list-disc list-inside space-y-2">
          <li>iOS-optimized UI components</li>
          <li>Zustand state management integration</li>
          <li>Haptic feedback support</li>
          <li>Persistent state across sessions</li>
          <li>Offline-first architecture</li>
        </ul>
      </div>
    ),
    usage: (
      <div className="p-4 space-y-4">
        <h3 className="text-lg font-medium">Usage Examples</h3>
        <div className="bg-gray-100 p-3 rounded-md">
          <pre className="text-sm overflow-auto">
            {`// Using TabsWithStore
<TabsWithStore
  groupId="settings-tabs"
  items={[
    { id: 'general', label: 'General' },
    { id: 'account', label: 'Account' }
  ]}
/>`}
          </pre>
        </div>
      </div>
    ),
    theming: (
      <div className="p-4 space-y-4">
        <h3 className="text-lg font-medium">Theme Settings</h3>
        <div className="flex gap-3">
          <StandardButton 
            onClick={() => setTheme('light')}
            variant={theme === 'light' ? 'default' : 'outline'}
          >
            Light
          </StandardButton>
          <StandardButton 
            onClick={() => setTheme('dark')}
            variant={theme === 'dark' ? 'default' : 'outline'}
          >
            Dark
          </StandardButton>
          <StandardButton 
            onClick={() => setTheme('system')}
            variant={theme === 'system' ? 'default' : 'outline'}
          >
            System
          </StandardButton>
        </div>
        <p className="text-sm text-muted-foreground">
          Current theme: <span className="font-medium">{theme}</span>
        </p>
      </div>
    )
  }
  
  return (
    <Section className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">UI Components with Zustand</h1>
        <p className="text-muted-foreground">
          This demo showcases UI components integrated with Zustand state management.
        </p>
      </div>
      
      {/* Tabs Demo */}
      <Card title="Tabs with Persistent State">
        <div className="p-4">
          <p className="mb-4 text-sm text-muted-foreground">
            These tabs maintain their state across page refreshes using Zustand.
          </p>
          
          <TabsWithStore
            groupId="demo-tabs"
            defaultTabId="features"
            items={[
              { id: 'features', label: 'Features', content: tabContents.features },
              { id: 'usage', label: 'Usage', content: tabContents.usage },
              { id: 'theming', label: 'Theming', content: tabContents.theming }
            ]}
          />
        </div>
      </Card>
      
      {/* Toast Demo */}
      <Card title="Toast Notifications">
        <div className="p-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            Click the buttons below to show different types of toast notifications.
          </p>
          
          <div className="flex flex-wrap gap-3">
            <StandardButton onClick={() => showToast('info')} variant="outline">
              Info Toast
            </StandardButton>
            <StandardButton onClick={() => showToast('success')} variant="outline">
              Success Toast
            </StandardButton>
            <StandardButton onClick={() => showToast('warning')} variant="outline">
              Warning Toast
            </StandardButton>
            <StandardButton onClick={() => showToast('error')} variant="outline">
              Error Toast
            </StandardButton>
          </div>
        </div>
      </Card>
      
      {/* Save Button Demo */}
      <Card title="Save Button with Offline Support">
        <div className="p-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            This save button handles offline states and provides appropriate feedback.
          </p>
          
          <div className="flex gap-3">
            <SaveButton
              onSave={() => {
                return new Promise<void>(resolve => {
                  setTimeout(() => {
                    showToast('success')
                    resolve()
                  }, 1500)
                })
              }}
            >
              Save Changes
            </SaveButton>
          </div>
        </div>
      </Card>
    </Section>
  )
}
