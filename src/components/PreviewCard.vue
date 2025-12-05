<script setup lang="ts">
import type { UserProfile } from '../types/user'

defineProps<{ profile: UserProfile }>()

// Platform icons/colors for preview
const platformStyles: Record<string, { color: string, icon: string }> = {
  instagram: { color: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)', icon: 'IG' },
  tiktok: { color: '#000000', icon: 'TT' },
  youtube: { color: '#FF0000', icon: 'YT' },
  twitter: { color: '#000000', icon: 'X' },
  website: { color: '#333333', icon: 'W' }
}
</script>

<template>
  <div class="preview-container-wrapper">
    <div class="mobile-frame">
      <div class="frame-content">
        <!-- Blue Header -->
        <div class="header-bg">
          <div class="header-content">
            <!-- User Avatar -->
            <div class="avatar-container">
              <div 
                class="avatar-img"
                :style="{ backgroundImage: profile.avatarUrl ? `url(${profile.avatarUrl})` : '' }"
              >
                 <div v-if="!profile.avatarUrl" class="avatar-placeholder"></div>
              </div>
              <div class="verified-badge">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="#fff"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" stroke="white" stroke-width="2"/></svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Profile Info -->
        <div class="profile-info">
          <h2 class="username">{{ profile.username || 'Please Enter' }}</h2>
          
          <div class="about-section">
            <h3 class="section-title">About me</h3>
            <p class="about-text">
              {{ profile.about || 'Please Enter' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.preview-container-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.mobile-frame {
  width: 320px;
  height: 343px; // Or fixed aspect ratio
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  overflow: hidden;
  position: relative;
}

.frame-content {
  height: 100%;
  overflow-y: auto;
  scrollbar-width: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
}

.header-bg {
  height: 140px;
  background: #3B82F6; // Royal Blue similar to screenshot
  position: relative;
  display: flex;
  justify-content: center;
}

.avatar-container {
  position: absolute;
  bottom: -40px; // Overlap
  width: 80px;
  height: 80px;
  left: 50%;
  transform: translateX(-50%);
  
  .avatar-img {
    width: 100%;
    height: 100%;
    border-radius: 20px; // Squircle shape
    background-color: #fff;
    background-size: cover;
    background-position: center;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    border: 4px solid #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .avatar-placeholder {
      width: 100%;
      height: 100%;
      background: #fff;
      border-radius: 16px;
    }
  }

  .verified-badge {
    position: absolute;
    bottom: -4px;
    right: -4px;
    background: #3B82F6; // Blue background for badge
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    
    svg {
      width: 12px;
      height: 12px;
    }
  }
}

.profile-info {
  margin-top: 50px;
  padding: 0 24px;
  text-align: center;

  .username {
    font-size: 20px;
    font-weight: 800; // Bold as in screenshot
    margin-bottom: 32px;
    color: #000;
  }

  .about-section {
    text-align: left;
    
    .section-title {
      font-size: 18px;
      font-weight: 800;
      margin-bottom: 8px;
      color: #000;
    }

    .about-text {
      font-size: 14px;
      color: #9CA3AF; // Lighter gray
      line-height: 1.5;
    }
  }
}
</style>
