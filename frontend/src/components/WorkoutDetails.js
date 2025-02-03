import { useState } from 'react';
import { useWorkoutsContext } from '../hooks/useWorkoutsContext';
import { useAuthContext } from '../hooks/useAuthContext';

// date-fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

const WorkoutDetails = ({ workout }) => {
  const { dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();

  // State to track edit form visibility and input values
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(workout.title);
  const [updatedLoad, setUpdatedLoad] = useState(workout.load);
  const [updatedReps, setUpdatedReps] = useState(workout.reps);

  const handleClickDelete = async () => {
    if (!user) {
      return;
    }

    const response = await fetch('/api/workouts/' + workout._id, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: 'DELETE_WORKOUT', payload: json });
    }
  };

  const handleClickUpdate = () => {
    setIsEditing(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      return;
    }

    const updatedWorkout = {
      title: updatedTitle,
      load: updatedLoad,
      reps: updatedReps,
    };

    const response = await fetch('/api/workouts/' + workout._id, {
      method: 'PATCH',
      body: JSON.stringify(updatedWorkout),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`,
      },
    });

    const json = await response.json();

    if (response.ok) {
      dispatch({ type: 'UPDATE_WORKOUT', payload: json });
      setIsEditing(false); // Close edit form
    }
  };

  return (
    <div className="workout-details">
      {!isEditing ? (
        <>
          <h4>{workout.title}</h4>
          <p><strong>Load (kg): </strong>{workout.load}</p>
          <p><strong>Reps: </strong>{workout.reps}</p>
          <p>{formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}</p>
          <span className="material-symbols-outlined" onClick={handleClickDelete}>delete</span>
          <button className="update-btn" onClick={handleClickUpdate}>Update</button>
        </>
      ) : (
        <form onSubmit={handleUpdateSubmit}>
          <div>
            <label>Title</label>
            <input
              type="text"
              value={updatedTitle}
              onChange={(e) => setUpdatedTitle(e.target.value)}
            />
          </div>
          <div>
            <label>Load (kg)</label>
            <input
              type="number"
              value={updatedLoad}
              onChange={(e) => setUpdatedLoad(e.target.value)}
            />
          </div>
          <div>
            <label>Reps</label>
            <input
              type="number"
              value={updatedReps}
              onChange={(e) => setUpdatedReps(e.target.value)}
            />
          </div>
          <button type="submit" className="update-btn">Save Changes</button>
          <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      )}
    </div>
  );
};

export default WorkoutDetails;
