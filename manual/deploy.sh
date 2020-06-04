#!/bin/bash

# Configure minikube docker env
eval $(minikube -p minikube docker-env)

# Build docker images
docker build -t posts:0.0.1 ../posts
docker build -t comments:0.0.1 ../comments
docker build -t query:0.0.1 ../query
docker build -t moderation:0.0.1 ../moderation
docker build -t event-bus:0.0.1 ../event-bus
docker build -t client:0.0.1 ../client

# Start deployments with ClusterIP & NodePort Service
kubectl apply -f ../infra/k8s/

# get deployment information
kubectl get service

# get nodeport IP
minikube ip
