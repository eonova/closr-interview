<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Plus, Delete, Link as LinkIcon, CloseBold } from '@element-plus/icons-vue'
import type { UploadFile } from 'element-plus'
import type { UserProfile, SocialLink } from '../types/user'

const props = defineProps<{ modelValue: UserProfile }>()
const emit = defineEmits<{ (e: 'update:modelValue', value: UserProfile): void }>()

// Extended type for local state management
interface LocalSocialLink extends SocialLink {
  isConfirmed: boolean
  error?: string
  isNew?: boolean // To track if it was just added
}

// Local state for social links to handle UI states (error, confirmed)
const localSocialLinks = ref<LocalSocialLink[]>([])

// Sync prop to local state (initially and when prop changes from outside)
watch(() => props.modelValue.socialLinks, (newLinks) => {
  if (localSocialLinks.value.length === 0 && newLinks.length > 0) {
    localSocialLinks.value = newLinks.map(link => ({
      ...link,
      isConfirmed: true, // Assume existing links are confirmed
      isNew: false
    }))
  }
}, { immediate: true })

const updateField = (field: keyof UserProfile, value: any) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value })
}

const availableTags = [
  { name: 'Health maintenance', icon: '🍵' },
  { name: 'Food travel', icon: '🥥' },
  { name: 'Art design', icon: '🎨' },
  { name: 'Sport', icon: '🏀' },
  { name: 'Travel', icon: '🏛️' },
]

// --- Actions ---

const addSocialLink = (platform: string) => {
  localSocialLinks.value.unshift({
    id: Date.now().toString(),
    platform: platform as any,
    url: '',
    isConfirmed: false,
    isNew: true
  })
}

const removeSocialLink = (index: number) => {
  localSocialLinks.value.splice(index, 1)
  syncSocialLinks()
}

const confirmSocialLink = (index: number) => {
  const link = localSocialLinks.value[index]
  
  // Basic Validation
  if (!link.url) {
    // Don't show error immediately if empty? Design shows "Please enter the link"
    // If clicked confirm with empty, maybe nothing happens or shake?
    // Let's just return for now or show minimal feedback.
    return
  }
  
  // Mock URL validation
  if (!link.url.includes('.')) {
    link.error = "This URL isn't available.Please try another."
    return
  }

  link.error = undefined
  link.isConfirmed = true
  link.isNew = false
  syncSocialLinks()
}

const syncSocialLinks = () => {
  const validLinks = localSocialLinks.value
    .filter(l => l.isConfirmed)
    .map(({ id, platform, url }) => ({ id, platform, url }))
  
  updateField('socialLinks', validLinks)
}

const handleAvatarChange = (file: UploadFile) => {
  if (file.raw) {
    const url = URL.createObjectURL(file.raw)
    updateField('avatarUrl', url)
  }
}

const handleBackgroundChange = (file: UploadFile) => {
  if (file.raw) {
    const url = URL.createObjectURL(file.raw)
    updateField('backgroundUrl', url)
  }
}

const toggleTag = (tag: string) => {
  const currentTags = [...props.modelValue.tags]
  const index = currentTags.indexOf(tag)
  if (index > -1) {
    currentTags.splice(index, 1)
  } else {
    currentTags.push(tag)
  }
  updateField('tags', currentTags)
}
</script>

<template>
  <div class="creator-form">
    <!-- Step 1: Choose URL -->
    <div class="form-step">
      <div class="step-indicator">
        <div class="number">1</div>
        <div class="vertical-line"></div>
      </div>
      <div class="step-content">
        <label class="step-label">Choose your URL</label>
        <div class="url-input-container">
          <span class="prefix">Closr.so/</span>
          <input 
            type="text" 
            :value="modelValue.customUrl"
            @input="(e) => updateField('customUrl', (e.target as HTMLInputElement).value)"
            class="custom-input no-border"
            placeholder="username"
          />
        </div>
      </div>
    </div>

    <!-- Step 2: Username -->
    <div class="form-step">
      <div class="step-indicator">
        <div class="number">2</div>
        <div class="vertical-line"></div>
      </div>
      <div class="step-content">
        <label class="step-label">Username</label>
        <input 
          type="text" 
          :value="modelValue.username"
          @input="(e) => updateField('username', (e.target as HTMLInputElement).value)"
          placeholder="Please Enter"
          class="custom-input"
        />
      </div>
    </div>

    <!-- Step 3: Profile Background -->
    <div class="form-step">
      <div class="step-indicator">
        <div class="number">3</div>
        <div class="vertical-line"></div>
      </div>
      <div class="step-content">
        <label class="step-label">Profile Background</label>
        <div class="upload-row">
          <!-- Avatar Upload -->
          <el-upload
            class="uploader-box avatar-box"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleAvatarChange"
          >
            <div v-if="modelValue.avatarUrl" class="preview-img avatar" :style="{ backgroundImage: `url(${modelValue.avatarUrl})` }"></div>
            <div v-else class="upload-placeholder">
              <el-icon class="plus-icon"><Plus /></el-icon>
            </div>
          </el-upload>

          <!-- Background Upload -->
          <el-upload
            class="uploader-box bg-box "
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleBackgroundChange"
          >
            <div v-if="modelValue.backgroundUrl" class="preview-img bg" :style="{ backgroundImage: `url(${modelValue.backgroundUrl})` }"></div>
            <div v-else class="upload-placeholder">
              <el-icon class="plus-icon"><Plus /></el-icon>
            </div>
          </el-upload>
        </div>
      </div>
    </div>

    <!-- Step 4: About me -->
    <div class="form-step">
      <div class="step-indicator">
        <div class="number">4</div>
        <div class="vertical-line"></div>
      </div>
      <div class="step-content">
        <label class="step-label">About me</label>
        <div class="textarea-wrapper">
          <textarea 
            :value="modelValue.about"
            @input="(e) => updateField('about', (e.target as HTMLInputElement).value)"
            placeholder="Please Enter"
            class="custom-textarea"
            rows="5"
            maxlength="500"
          ></textarea>
          <span class="char-count">{{ modelValue.about.length }}/500</span>
        </div>
      </div>
    </div>

    <!-- Step 5: Social Media -->
    <div class="form-step">
      <div class="step-indicator">
        <div class="number">5</div>
        <div class="vertical-line"></div>
      </div>
      <div class="step-content">
        <label class="step-label">Social Media</label>
        
        <!-- Icon Row -->
        <div class="social-icons-row">
          <button class="icon-btn instagram" @click="addSocialLink('instagram')">
            <svg viewBox="0 0 24 24" width="24" height="24"><defs><linearGradient id="ig-grad" x1="2" y1="21" x2="22" y2="3"><stop offset="0" stop-color="#f09433"/><stop offset="0.25" stop-color="#e6683c"/><stop offset="0.5" stop-color="#dc2743"/><stop offset="0.75" stop-color="#cc2366"/><stop offset="1" stop-color="#bc1888"/></linearGradient></defs><rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#ig-grad)" stroke-width="2" fill="none"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="url(#ig-grad)" stroke-width="2" fill="none"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="url(#ig-grad)" stroke-width="2" stroke-linecap="round"/></svg>
          </button>
          <button class="icon-btn tiktok" @click="addSocialLink('tiktok')">
             <svg viewBox="0 0 24 24" width="24" height="24" fill="#000"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
          </button>
          <button class="icon-btn youtube" @click="addSocialLink('youtube')">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="#FF0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="white"/><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" fill="#FF0000"/></svg>
          </button>
          <button class="icon-btn x" @click="addSocialLink('twitter')">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="#000"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </button>
          <button class="icon-btn website dashed" @click="addSocialLink('website')">
             <el-icon><LinkIcon /></el-icon>
          </button>

        </div>

        <!-- Links List -->
        <div class="links-list">
          <div 
            v-for="(link, index) in localSocialLinks" 
            :key="link.id" 
            class="social-block"
          >
            <div class="link-row">
              <!-- Platform Icon (Left) -->
              <div class="row-icon" :class="link.platform">
                <svg v-if="link.platform === 'instagram'" viewBox="0 0 24 24" width="16" height="16" fill="#fff"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                <svg v-else-if="link.platform === 'tiktok'" viewBox="0 0 24 24" width="16" height="16" fill="#fff"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                <svg v-else-if="link.platform === 'youtube'" viewBox="0 0 24 24" width="16" height="16" fill="#fff"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                <svg v-else-if="link.platform === 'twitter'" viewBox="0 0 24 24" width="14" height="14" fill="#fff"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                <el-icon v-else><LinkIcon /></el-icon>
              </div>

              <!-- Input or Display Area -->
              <div class="input-wrapper">
                <input 
                  v-if="!link.isConfirmed"
                  type="text" 
                  v-model="link.url" 
                  placeholder="Please enter the link"
                  class="social-input"
                />
                <div v-else class="link-display">
                  {{ link.url }}
                </div>
                
                <!-- Error Icon inside input -->
                <div v-if="link.error" class="error-icon">
                  <el-icon><CloseBold /></el-icon>
                </div>
              </div>

              <!-- Actions (Right Side) -->
               <button 
                 v-if="!link.isConfirmed" 
                 class="confirm-btn" 
                 :class="{ active: link.url.length > 0 }"
                 @click="confirmSocialLink(index)"
               >
                 Confirm
               </button>
               <button v-else class="delete-btn-square" @click="removeSocialLink(index)">
                 <el-icon><Delete /></el-icon>
               </button>
            </div>
            
            <!-- Error Message (Below) -->
            <div v-if="link.error" class="error-msg">
              {{ link.error }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Step 6: Tags -->
    <div class="form-step">
      <div class="step-indicator">
        <div class="number">6</div>
      </div>
      <div class="step-content">
        <label class="step-label">Tags</label>
        <div class="tags-wrapper">
          <div 
            v-for="tag in availableTags" 
            :key="tag.name" 
            class="tag-pill"
            :class="{ active: modelValue.tags.includes(tag.name) }"
            @click="toggleTag(tag.name)"
          >
            <span class="tag-icon">{{ tag.icon }}</span>
            {{ tag.name }}
          </div>
        </div>
      </div>
    </div>

    <!-- Continue Button -->
    <div class="form-footer">
      <button class="continue-btn">Continue</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.creator-form {
  display: flex;
  flex-direction: column;
  gap: 24px; // Reduced from 40px for closer layout
  padding-bottom: 40px;
  max-width: 600px; 
}

.form-step {
  display: flex;
  gap: 16px;
  position: relative;

  .step-indicator {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .number {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 1px solid #e0e0e0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
      color: #666;
      background: #fff;
      z-index: 2;
    }

    .vertical-line {
      flex: 1;
      width: 0;
      border-left: 1px dashed #e0e0e0;
      margin-top: 8px;
      margin-bottom: -28px; // Increased overlap to bridge the gap
      position: relative;
      z-index: 1;
    }
  }

  .step-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .step-label {
    font-size: 16px;
    font-weight: 700;
    color: #1a1a1a;
  }
}

// Inputs
.custom-input {
  width: 100%;
  padding: 12px 16px;
  background: #f9f9f9;
  border: 1px solid transparent;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  color: #333;

  &::placeholder {
    color: #ccc;
  }

  &:focus {
    background: #fff;
    border-color: #eee;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }
}

.url-input-container {
  display: flex;
  align-items: center;
  background: #f9f9f9;
  border-radius: 8px;
  padding: 0 16px;
  
  .prefix {
    color: #999;
    font-size: 14px;
    margin-right: 4px;
  }

  .custom-input.no-border {
    padding-left: 0;
    background: transparent;
    border: none;
    box-shadow: none;
  }
}

// Uploaders
.upload-row {
  display: flex;
  gap: 20px;
}

.uploader-box {
  border: 1px dashed #eee;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.2s;
  background: #fff;
  overflow: hidden;
  position: relative;

  &:hover {
    border-color: #ccc;
  }

  .upload-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .plus-icon {
      font-size: 24px;
      color: #ccc;
    }
  }

  .preview-img {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
  }
}

.avatar-box {
  width: 100px;
  height: 100px;
  
  ::v-deep(.el-upload) {
    width: 100%;
    height: 100%;
  }
}

.bg-box {
  width: 180px;
  height: 100px;

  ::v-deep(.el-upload) {
    width: 100%;
    height: 100%;
  }
}

// About Textarea
.textarea-wrapper {
  position: relative;
  
  .custom-textarea {
    width: 100%;
    padding: 12px 16px;
    background: #f9f9f9;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    resize: none;
    outline: none;
    font-family: inherit;
    padding-bottom: 30px;

    &::placeholder {
      color: #ccc;
    }
  }

  .char-count {
    position: absolute;
    bottom: 12px;
    right: 16px;
    font-size: 12px;
    color: #ccc;
  }
}

// Social Media
.social-icons-row {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  position: relative;
  align-items: center;

  .icon-btn {
    width: 48px;
    height: 48px;
    border-radius: 16px; // Squircle
    border: none;
    background: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    transition: transform 0.1s;

    &:hover {
      transform: translateY(-2px);
    }

    &.website {
      box-shadow: none;
      border: 1px dashed #ccc;
      background: transparent;
      color: #333;
    }
  }

  .hint-tooltip {
    position: absolute;
    left: 100%;
    margin-left: 12px;
    background: #4caf50;
    color: #fff;
    padding: 10px 16px;
    border-radius: 8px;
    font-size: 14px;
    line-height: 1.4;
    white-space: nowrap;
    width: max-content;
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
    z-index: 10;
    
    &::before {
      content: '';
      position: absolute;
      left: -6px;
      top: 50%;
      transform: translateY(-50%);
      border-top: 6px solid transparent;
      border-bottom: 6px solid transparent;
      border-right: 6px solid #4caf50;
    }
  }
}

.links-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.social-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.link-row {
  display: flex;
  align-items: center;
  gap: 16px;
  
  .row-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    
    &.instagram { background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%); }
    &.tiktok { background: #000; }
    &.youtube { background: #ff0000; }
    &.twitter { background: #000; }
    &.website { background: #333; }
  }

  .input-wrapper {
    flex: 1;
    background: #f9f9f9;
    border-radius: 12px;
    padding: 4px 16px;
    display: flex;
    align-items: center;
    height: 48px;
    position: relative;
    
    .social-input {
      width: 100%;
      border: none;
      background: transparent;
      font-size: 14px;
      outline: none;
      color: #333;
      height: 100%;
      
      &::placeholder {
        color: #ccc;
      }
    }
    
    .link-display {
      font-size: 14px;
      color: #333;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 300px;
    }

    .error-icon {
      width: 18px;
      height: 18px;
      background: #ff4d4f;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 10px;
      flex-shrink: 0;
      margin-left: 8px;
    }
  }

  .confirm-btn {
    height: 48px;
    padding: 0 24px;
    border: 1px solid #e0e0e0;
    background: #fff;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 700;
    color: #ccc; // Default disabled color
    cursor: default;
    transition: all 0.2s;
    
    &.active {
      color: #000;
      cursor: pointer;
      border-color: #ccc;
      
      &:hover {
        background: #f5f5f5;
      }
    }
  }

  .delete-btn-square {
    width: 48px;
    height: 48px;
    border: 1px solid #e0e0e0;
    background: #fff;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #000;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      background: #fff5f5;
      border-color: #ffcccc;
      color: #ff4d4f;
    }
  }
}

.error-msg {
  color: #ff4d4f;
  font-size: 13px;
  margin-left: 48px; // Align with input start (32px icon + 16px gap)
}

// Tags
.tags-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  .tag-pill {
    padding: 8px 16px;
    background: #fff;
    border: 1px solid #eee;
    border-radius: 20px;
    font-size: 13px;
    color: #333;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.02);

    &:hover {
      background: #f9f9f9;
    }

    &.active {
      border-color: #333;
      font-weight: 500;
    }
  }
}

// Footer
.form-footer {
  margin-top: 20px;
  
  .continue-btn {
    width: 100%;
    padding: 14px;
    background: linear-gradient(90deg, #2979FF, #448AFF);
    color: #fff;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s;
    
    &:hover {
      opacity: 0.9;
    }
  }
}

@media (max-width: 768px) {
  .creator-form {
    padding-bottom: 80px; // Extra space for mobile bottom safety
  }

  .upload-row {
    flex-wrap: wrap;
  }

  .social-icons-row {
    flex-wrap: wrap;
    justify-content: flex-start;
  }
  
  .links-list .link-row {
    gap: 12px;
  }
  
  .links-list .input-wrapper {
    height: 44px;
  }
  
  .links-list .confirm-btn,
  .links-list .delete-btn-square {
    height: 44px;
    width: 44px;
    padding: 0; // Icon only style for space saving if needed, or just smaller padding
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
