/*
 * @Project Bluezone
 * @Author Bluezone Global (contact@bluezone.ai)
 * @Createdate 04/26/2020, 16:36
 *
 * This file is part of Bluezone (https://bluezone.ai)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';

import {getJobImmediately, setJobImmediately} from './storage';

/**
 * Tra ve danh sach cac cong viec can thuc hien lai do chua thuc hien thanh cong truoc day
 * @returns {Promise<Array>}
 */
const getJobs = async () => {
  return (await getJobImmediately()) || [];
};

// TODO Them kiem soat cung 1 id thi update de vao id da co
/**
 * Them 1 cong viec can thuc hien lai do chua thuc hien thanh cong
 * @param job
 * @returns {Promise<void>}
 */
const addJob = async (job = {}) => {
  if (!job.id) {
    job.id = new Date().getTime();
  }

  const jobImmediately = await getJobs();
  jobImmediately.push(job);
  setJobImmediately(jobImmediately);
};

/**
 * Xoa bo 1 cong viec can xu ly lai do vua chua thuc hien thanh cong
 * @param job
 * @returns {Promise<void>}
 */
const removeJob = async (job = {}) => {
  if (!job.id) {
    return;
  }

  const jobImmediately = await getJobs();
  if (jobImmediately.length === 0) {
    return;
  }

  for (let i = 0; i < jobImmediately.length; i++) {
    if (jobImmediately[i].id === job.id) {
      jobImmediately.splice(i, 2);
      i--;
    }
  }
  setJobImmediately(jobImmediately);
};

export {getJobs, addJob, removeJob};
