import {
  observable,
  action,
  makeObservable,
  computed,
  configure,
  runInAction,
} from "mobx";
import { createContext, SyntheticEvent } from "react";
import { IActivity } from "../models/activity";
import agent from "../api/agent";

configure({ enforceActions: "always" });

class ActivityStore {
  @observable
  public activities: IActivity[] = [];
  @observable
  public loading: boolean = false;
  @observable
  selectedActivity: IActivity | undefined;
  @observable
  editMode: boolean = false;
  @observable
  submitting = false;
  @observable
  activityRegistry = new Map();
  @observable
  target = "";
  constructor() {
    makeObservable(this);
  }

  @computed get activitiesByDate() {
    return Array.from(this.activityRegistry.values())
      .slice()
      .sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
  }

  @action
  public loadActivities = async () => {
    this.loading = true;
    try {
      const activities = await agent.Activities.list();
      runInAction(() => {
        activities.forEach((activity) => {
          activity.date = activity.date.split(".")[0];
          this.activityRegistry.set(activity.id, activity);
        });
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.log(error);
    }
  };

  @action
  public createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      this.activityRegistry.set(activity.id, activity);
      this.editMode = false;
      this.submitting = false;
    } catch (error) {
      console.log(error);
      this.submitting = false;
    }
  };

  @action
  public editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activity);
      this.activityRegistry.set(activity.id, activity);
      this.selectedActivity = activity;
      this.editMode = false;
      this.submitting = false;
    } catch (error) {
      console.log(error);
      this.submitting = false;
    }
  };

  @action
  public deleteActivity = async (
    id: string,
    event: SyntheticEvent<HTMLButtonElement>
  ) => {
    this.submitting = true;
    this.target = event.currentTarget.name;
    try {
      await agent.Activities.delete(id);
      this.activityRegistry.delete(id);
      this.submitting = false;
      this.target = "";
    } catch (error) {
      console.log(error);
      this.submitting = false;
      this.target = "";
    }
  };

  @action
  public openEditForm = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id);
    this.editMode = true;
  };

  @action
  public cancelSelectedActivity = () => {
    this.selectedActivity = undefined;
  };

  @action
  public cancelFormOpen = () => {
    this.editMode = false;
  };

  @action
  public openCreateForm = () => {
    this.editMode = true;
    this.selectedActivity = undefined;
  };

  @action
  public selectActivity = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id);
    this.editMode = false;
  };
}

export default createContext(new ActivityStore());
