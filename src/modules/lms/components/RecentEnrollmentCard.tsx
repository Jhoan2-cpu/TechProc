import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import type { RecentEnrollment } from '../types';

interface RecentEnrollmentCardProps {
  enrollment: RecentEnrollment;
}

export const RecentEnrollmentCard = ({ enrollment }: RecentEnrollmentCardProps) => {
  return (
    <div className="p-4 bg-secondary-600/50 rounded-lg hover:bg-secondary-600/70 transition-all duration-300 cursor-pointer border border-transparent hover:border-primary-500/20">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">
            {enrollment.student_name.charAt(0)}
          </span>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-white text-sm mb-1">
            {enrollment.student_name}
          </h3>
          <p className="text-xs text-gray-400 mb-1">
            {enrollment.student_email}
          </p>
          <p className="text-xs text-gray-300 font-medium">
            → {enrollment.course_title}
          </p>
          <p className="text-xs text-gray-300 mt-2">
            <FontAwesomeIcon icon={faClock} className="mr-1" />
            {new Date(enrollment.enrolled_at).toLocaleString('es-ES')}
          </p>
        </div>
      </div>
    </div>
  );
};
