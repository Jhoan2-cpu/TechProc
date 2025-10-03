import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import type { RecentEnrollment } from '../types';

interface RecentEnrollmentCardProps {
  enrollment: RecentEnrollment;
}

export const RecentEnrollmentCard = ({ enrollment }: RecentEnrollmentCardProps) => {
  return (
    <div className="p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">
            {enrollment.student_name.charAt(0)}
          </span>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-secondary-900 text-sm mb-1">
            {enrollment.student_name}
          </h3>
          <p className="text-xs text-secondary-600 mb-1">
            {enrollment.student_email}
          </p>
          <p className="text-xs text-secondary-700 font-medium">
            → {enrollment.course_title}
          </p>
          <p className="text-xs text-secondary-500 mt-2">
            <FontAwesomeIcon icon={faClock} className="mr-1" />
            {new Date(enrollment.enrolled_at).toLocaleString('es-ES')}
          </p>
        </div>
      </div>
    </div>
  );
};
