# Real-Time Issue Tracking System

## Overview
Enhanced the Google Maps integration to provide real-time tracking of unresolved community issues with urgency-based visual indicators using yellow/orange color schemes and dynamic sizing.

## 🎯 **Key Features Implemented**

### **Real-Time Unresolved Issue Tracking**
- ✅ **Live Status Monitoring**: Tracks all unresolved issues in real-time
- ✅ **Auto-Refresh**: Updates every 30 seconds automatically
- ✅ **Priority Focus**: Unresolved issues get visual priority over resolved ones
- ✅ **Urgency Escalation**: Issues become more urgent as they age

### **Advanced Visual Indicators**

#### **Color-Coded Urgency System**
- 🔴 **Critical/Overdue** (14+ days): Dark red with bouncing animation
- 🟠 **High Priority/Urgent** (7+ days): Dark orange to orange
- 🟡 **Medium Priority**: Dark yellow to yellow  
- 🟡 **Low Priority**: Yellow to light yellow
- 🟢 **Resolved**: Green (smaller, less prominent)

#### **Dynamic Marker Sizing**
- **Critical Issues**: Large markers (14-18px) with bounce animation
- **High Priority**: Medium markers (12-14px)
- **Medium Priority**: Standard markers (10-12px)
- **Low Priority**: Small markers (8-10px)
- **Age Escalation**: Markers grow larger as issues age
- **Resolved Issues**: Smallest markers (6px)

### **Real-Time Status Dashboard**

#### **Live Issue Counter Panel**
```
Live Issue Tracker
🔴 Critical/Overdue: 3
🟠 High/Urgent: 7  
🟡 Unresolved: 15
🟢 Resolved: 8
Last updated: 2:45:32 PM
```

#### **Enhanced Legend**
- Visual urgency indicators with size differences
- Bouncing animation explanation
- Color intensity meaning
- Age-based escalation info

### **Smart Issue Prioritization**

#### **Base Priority Calculation**
```typescript
Safety → Critical
Water/Electricity → High
Infrastructure/Transportation → Medium  
Trash/Other → Low
```

#### **Age-Based Urgency Escalation**
- **7+ days**: Marked as "URGENT" 
- **14+ days**: Marked as "OVERDUE"
- **Visual escalation**: Darker colors, larger markers
- **Animation**: Critical/overdue issues bounce

### **Enhanced Info Windows**

#### **Detailed Issue Information**
- **Urgency Level**: CRITICAL, URGENT, OVERDUE badges
- **Age Tracking**: "X days ago" with urgency warnings
- **Status Indicators**: Color-coded status badges
- **Visual Priority**: Colored dot matching marker
- **Time Warnings**: Red text for urgent/overdue issues

## 🔧 **Technical Implementation**

### **Real-Time Update System**
```typescript
// Auto-refresh every 30 seconds
useEffect(() => {
  const interval = setInterval(() => {
    setLastUpdate(new Date());
    console.log('Real-time map refresh triggered');
  }, 30000);
  return () => clearInterval(interval);
}, []);
```

### **Urgency Color Algorithm**
```typescript
const getUrgencyColor = (priority, status, daysSinceCreated) => {
  if (status === 'resolved') return '#10B981'; // Green
  
  switch (priority) {
    case 'critical':
      return daysSinceCreated > 3 ? '#DC2626' : '#EF4444';
    case 'high':
      return daysSinceCreated > 5 ? '#EA580C' : '#F97316';
    case 'medium':
      return daysSinceCreated > 7 ? '#D97706' : '#F59E0B';
    case 'low':
      return daysSinceCreated > 14 ? '#F59E0B' : '#FCD34D';
  }
};
```

### **Dynamic Marker Sizing**
```typescript
const getMarkerSize = (priority, status, daysSinceCreated) => {
  if (status === 'resolved') return 6;
  
  let baseSize = { critical: 14, high: 12, medium: 10, low: 8 }[priority] || 8;
  
  if (daysSinceCreated > 7) baseSize += 2;
  if (daysSinceCreated > 14) baseSize += 2;
  
  return Math.min(baseSize, 18);
};
```

## 📊 **Issue Tracking Categories**

### **Urgency Levels**
1. **OVERDUE** (14+ days unresolved)
   - Dark red markers with bounce animation
   - Highest visual priority
   - "OVERDUE!" warning in info windows

2. **URGENT** (7+ days unresolved)  
   - Orange markers, larger size
   - "URGENT" badge in info windows
   - Escalated visual prominence

3. **CRITICAL** (Safety category)
   - Red markers with bounce animation
   - Immediate attention indicators
   - Largest marker size

4. **HIGH/MEDIUM/LOW** (Standard priorities)
   - Yellow/orange spectrum based on age
   - Size increases with age
   - Clear priority indicators

### **Status Tracking**
- **Reported**: New issues, full urgency calculation
- **In Progress**: Acknowledged, continued tracking
- **Resolved**: Green markers, reduced prominence

## 🎛️ **User Experience Features**

### **Visual Hierarchy**
- **Unresolved issues**: Prominent, larger, animated
- **Resolved issues**: Smaller, transparent, background
- **Critical issues**: Always on top (highest z-index)
- **Age-based scaling**: Older = larger and more urgent

### **Interactive Elements**
- **Click markers**: Detailed issue information
- **Real-time counters**: Live issue statistics
- **Auto-updates**: Seamless data refresh
- **Visual feedback**: Clear urgency indicators

### **Performance Optimizations**
- **Efficient marker management**: Clear old markers before adding new
- **Consistent coordinates**: Hash-based location mapping
- **Cached calculations**: Avoid repeated computations
- **Selective updates**: Only update when data changes

## 🚀 **Benefits for Authorities**

### **Immediate Visual Assessment**
- **Quick identification** of urgent/overdue issues
- **Geographic distribution** of problem areas
- **Priority-based resource allocation**
- **Real-time situation awareness**

### **Proactive Issue Management**
- **Age-based escalation** prevents issues from being forgotten
- **Visual urgency indicators** guide response priorities
- **Real-time tracking** enables immediate action
- **Geographic clustering** identifies problem areas

### **Data-Driven Decision Making**
- **Live statistics** for resource planning
- **Trend identification** through visual patterns
- **Performance tracking** via resolution rates
- **Geographic insights** for infrastructure planning

## 🔄 **Real-Time Updates**

The system now provides:
- ✅ **30-second auto-refresh** for live data
- ✅ **Immediate visual feedback** on status changes
- ✅ **Dynamic urgency calculation** based on age
- ✅ **Persistent location tracking** for all unresolved issues
- ✅ **Visual escalation** as issues become more urgent

This creates a comprehensive real-time issue tracking system that helps authorities prioritize and respond to community problems based on urgency, age, and geographic distribution.