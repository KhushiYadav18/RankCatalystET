/**
 * Attention tracking utilities
 * Computes attention metrics from gaze samples
 */
import type { AttentionMetrics } from '@/lib/types';
import type { GazeSample } from './webgazerClient';

export function computeAttentionMetrics(
  questionBox: DOMRect | null,
  samples: GazeSample[]
): AttentionMetrics {
  if (!samples.length) {
    return {
      attention_ratio: 0,
      off_screen_ratio: 0,
      off_screen_duration_ms: 0,
      num_gaze_samples: 0,
      num_on_task_samples: 0,
      num_off_task_samples: 0,
      option_changes: 0,
      raw_attention_trace: [],
    };
  }

  let numOnTask = 0;
  let numOffTask = 0;
  let numOffScreen = 0;
  let offScreenDuration = 0;
  const trace: { t_ms: number; on_task: boolean }[] = [];

  let lastValidTime = samples[0]?.timestamp || 0;

  samples.forEach((sample, index) => {
    const isOffScreen = sample.x === null || sample.y === null;
    
    if (isOffScreen) {
      numOffScreen++;
      if (index > 0) {
        const timeSinceLastSample = sample.timestamp - lastValidTime;
        offScreenDuration += timeSinceLastSample;
      }
      numOffTask++;
      trace.push({ t_ms: sample.timestamp - (samples[0]?.timestamp || 0), on_task: false });
      return;
    } else {
      lastValidTime = sample.timestamp;
    }

    if (!questionBox) {
      // No question box, consider all valid samples as off-task
      numOffTask++;
      trace.push({ t_ms: sample.timestamp - (samples[0]?.timestamp || 0), on_task: false });
      return;
    }

    // TypeScript guard: we know x and y are not null here because we returned early if isOffScreen
    if (sample.x === null || sample.y === null) {
      // This shouldn't happen due to early return, but TypeScript needs this
      numOffTask++;
      trace.push({ t_ms: sample.timestamp - (samples[0]?.timestamp || 0), on_task: false });
      return;
    }

    // Check if sample is within question box bounds
    // STRICT: No padding - only samples directly on question area count
    // This makes attention metrics more accurate and responsive
    const onTask =
      sample.x >= questionBox.left &&
      sample.x <= questionBox.right &&
      sample.y >= questionBox.top &&
      sample.y <= questionBox.bottom;

    if (onTask) {
      numOnTask++;
    } else {
      numOffTask++;
    }

    trace.push({ t_ms: sample.timestamp - (samples[0]?.timestamp || 0), on_task: onTask });
  });

  const totalSamples = samples.length;
  // Calculate attention ratio - strict calculation
  // Only count samples that are actually on task
  const attentionRatio = totalSamples > 0 ? numOnTask / totalSamples : 0;
  const offScreenRatio = totalSamples > 0 ? numOffScreen / totalSamples : 0;
  
  // Additional penalty for confusion: if user is looking around a lot
  // (many off-task samples), reduce attention further
  const confusionPenalty = numOffTask > numOnTask * 2 ? 0.7 : 1.0; // 30% penalty if very distracted
  const adjustedAttentionRatio = attentionRatio * confusionPenalty;

  // Downsample trace for storage (keep every 10th sample)
  const downsampledTrace = trace.filter((_, index) => index % 10 === 0);

  return {
    attention_ratio: adjustedAttentionRatio, // Use adjusted ratio with confusion penalty
    off_screen_ratio: offScreenRatio,
    off_screen_duration_ms: offScreenDuration,
    num_gaze_samples: totalSamples,
    num_on_task_samples: numOnTask,
    num_off_task_samples: numOffTask,
    option_changes: 0, // Will be set by the quiz component
    raw_attention_trace: downsampledTrace,
  };
}

