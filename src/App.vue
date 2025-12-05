<script setup lang="ts">
import { ref } from 'vue'
import { House, Document, Message, ArrowLeft } from '@element-plus/icons-vue'
import CreatorForm from './components/CreatorForm.vue'
import PreviewCard from './components/PreviewCard.vue'
import type { UserProfile } from './types/user'

const userProfile = ref<UserProfile>({
  customUrl: '',
  username: '',
  avatarUrl: '',
  backgroundUrl: '',
  about: '',
  socialLinks: [],
  tags: []
})

const showMobilePreview = ref(false)
</script>

<template>
  <div class="app-container">
    <!-- Global Top Header (Desktop) -->
    <header class="global-header">
      <div class="logo-area">
        <h1>Closr</h1>
      </div>
      
      <div class="user-profile-pill">
        <img src="https://ui-avatars.com/api/?name=Chris+Wu&background=0D8ABC&color=fff" class="user-avatar" />
        <div class="user-info">
          <div class="name-row">
            <span class="name">Chris Wu</span>
            <div class="verified-badge-small">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="#999"><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-4-3.99-4-1.59 0-2.97.88-3.6 2.16C12.5 4.79 11.5 4 10.5 4 8.29 4 6.5 5.79 6.5 8c0 .495.084.965.238 1.4C5.425 10.05 4.55 11.42 4.55 13c0 2.21 1.71 4 3.99 4 1.59 0 2.97-.88 3.6-2.16C12.5 15.79 13.5 16.5 14.5 16.5c2.21 0 4-1.79 4-4 0-.495-.084-.965-.238-1.4 1.273.65 2.148 2.02 2.148 3.6z" fill="#ccc"/><path d="M10 15.17l-3.88-3.88L4.71 12.71 10 18l9.29-9.29-1.41-1.41L10 15.17z" fill="white"/></svg>
            </div>
          </div>
          <span class="id">ID:9732002</span>
        </div>
        <span class="dropdown-arrow">﹀</span>
      </div>
    </header>

    <!-- Mobile Header -->
    <header class="mobile-header">
      <button class="back-btn">
        <el-icon><ArrowLeft /></el-icon>
      </button>
      <h1 class="mobile-title">Become a creator</h1>
      <button class="preview-toggle-btn" @click="showMobilePreview = !showMobilePreview">
        {{ showMobilePreview ? 'Close' : 'Preview' }}
      </button>
    </header>

    <div class="main-body">
      <!-- Sidebar -->
      <aside class="sidebar">
        <nav class="nav-menu">
          <div class="menu-item active">
            <el-icon><House /></el-icon>
            <span>Home</span>
          </div>
          <div class="menu-item">
            <el-icon><Document /></el-icon>
            <span>Order</span>
          </div>
          <div class="menu-item">
            <el-icon><Message /></el-icon>
            <span>Message</span>
          </div>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="content-area">
        <div class="breadcrumbs-area">
           <div class="breadcrumbs">
             <span class="crumb">Home</span> / <span class="crumb">Manage my page</span> / <span class="crumb active">Become a creator</span>
           </div>
        </div>

        <div class="scrollable-content">
          <div class="split-view">
            <div class="form-container">
              <h2 class="section-title desktop-only">Become a creator</h2>
              <CreatorForm v-model="userProfile" />
            </div>
            
            <div class="preview-wrapper-col" :class="{ 'mobile-visible': showMobilePreview }">
              <PreviewCard :profile="userProfile" />
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style lang="scss">
// Reset & Global
body {
  margin: 0;
  padding: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #fff; // Changed to white as per design (or very light grey)
  color: #333;
}

* {
  box-sizing: border-box;
}

.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.global-header {
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 32px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  z-index: 100;

  .logo-area h1 {
    margin: 0;
    font-size: 24px;
    font-weight: 800;
  }

  .user-profile-pill {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      
      .name-row {
        display: flex;
        align-items: center;
        gap: 4px;
        font-weight: 600;
        font-size: 14px;
      }

      .id {
        font-size: 12px;
        color: #999;
      }
    }

    .dropdown-arrow {
      color: #999;
      font-size: 12px;
    }
  }
}

// Mobile Header (Hidden by default)
.mobile-header {
  display: none;
  height: 56px;
  padding: 0 16px;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  z-index: 200;

  .back-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
  }

  .mobile-title {
    font-size: 18px;
    font-weight: 700;
    margin: 0;
  }

  .preview-toggle-btn {
    background: #2979FF;
    color: #fff;
    border: none;
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
  }
}

.main-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar {
  width: 240px;
  padding: 24px 16px;
  border-right: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;

  .nav-menu {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: 12px;
    color: #666;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s;

    &:hover {
      background: #f5f5f5;
    }

    &.active {
      background: #1a1a1a;
      color: #fff;
    }
  }
}

.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f2f3f5; // Light grey background for contrast
  overflow: hidden;
}

.breadcrumbs-area {
  padding: 24px 40px;
  
  .breadcrumbs {
    font-size: 14px;
    color: #999;

    .crumb.active {
      color: #000;
      font-weight: 600;
    }
  }
}

.scrollable-content {
  flex: 1;
  overflow-y: auto;
  padding: 0 40px 40px;
}

.split-view {
  display: flex;
  gap: 5px;
  max-width: 1200px;
  margin: 0 auto;
  align-items: flex-start; // Align items to top
}

.form-container {
  flex: 1;
  min-width: 0; // Prevent overflow
  background: #fff;
  border-radius: 32px; // White rounded background
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.02); // Subtle shadow
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 32px;
  margin-top: 0; // Ensure no top margin
}

.preview-wrapper-col {
  width: 360px; // Fixed width for preview column
  flex-shrink: 0;
  position: sticky;
  top: 0;
}

// --- Mobile Responsiveness ---
@media (max-width: 768px) {
  .global-header {
    display: none;
  }

  .mobile-header {
    display: flex;
  }

  .sidebar {
    display: none;
  }

  .breadcrumbs-area {
    display: none;
  }

  .content-area {
    background: #fff; // White background on mobile
  }

  .scrollable-content {
    padding: 0 16px 40px; // Reduce padding
  }

  .split-view {
    flex-direction: column;
    gap: 0;
  }

  .form-container {
    padding: 24px 0; // Remove horizontal padding from container
    border-radius: 0;
    box-shadow: none;
    background: transparent;
  }

  .section-title.desktop-only {
    display: none;
  }

  // Preview Overlay logic
  .preview-wrapper-col {
    position: fixed;
    top: 56px; // Below header
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: calc(100vh - 56px);
    background: rgba(255,255,255,0.98);
    z-index: 300;
    display: none; // Hidden by default
    padding: 20px;
    overflow-y: auto;

    &.mobile-visible {
      display: flex;
      justify-content: center;
    }
  }
}
</style>
