---
layout: post
title:  "Scaling Puppeteer In Kubernetes"
date:   2020-10-26 23:29:39 -0400
categories: kubernetes
---

When trying to run large number of chrome process using puppeteer in kubernetes, there are some note worthy observation:

**Running large number of chrome process in one container does not mean better performance.**

It's common practice to set a timeout when doing browser automation. When running large number of chrome process within a single container, instead of getting multiple tasks done, the majority of the tasks might just timeout. Of course this can be solved by increasing the timeout value, but then the system overall will be less responsive.

**Requesting high CPU/Memory resource per container will underutilize worker node.**

Based on observation, on AWS c5.2xlarge instance, when running 7 containers, with 1 CPU request per container, and each container running 20 chrome processes, for most of the time, CPU utilization is well below 9%. This is probably due to browser tasks are often IO heavy.


**So far, the best combination seems to be:**
* Running small number of chrome process per container. For example, limit each container to run only 3 chrome process, so the timeout value can stay low.
* Request small amount of resource per container, but give it high limit. For example, request 400m CPU, and set the limit to 3000m. This gives better worker node resource utilization.
* Set HPA(HorizontalPodAutoScaler) target based on CPU. Because CPU utilization will start to climb when browser starts to load the pages.
