import StarSolid from "@modules/common/icons/star-solid";
import Star from "@modules/common/icons/star";

interface RateStarsProps {
  repeatCount: number;
  maxRate: number;
  size?: number;
}

export const ReateStars: React.FC<RateStarsProps> = ({ repeatCount, maxRate, size }) => {
  
  const indicesArray: number[] = Array.from({ length: repeatCount }, (_, i) => i);
  const reverseArray: number[] = Array.from({ length: maxRate - repeatCount }, (_, i) => i);

  return (
    <div style={{ display: 'flex', gap: '5px' }}>
      
      {indicesArray.map((index) => (
        <StarSolid key={index} size={size} />
      ))}

       {reverseArray.map((index) => (
        <Star key={index} size={size} />
      ))}

    </div>
  );
};