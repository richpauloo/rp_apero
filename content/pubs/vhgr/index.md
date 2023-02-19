---
title: Hydraulic Gradients Modulate Non-Fickian Transport in Heterogeneous Porous Media
date: "2021-03-04T00:00:00Z"
authors:
- Rich
- Graham E. Fogg
- Zhilin Guo
- Christopher V. Henri
slug: vhgr
doi: '10.1029/2020WR028655'
publication_types: ["2"]
# Publication name and optional abbreviated publication name.
publication: "*Water Resources Research*"
publication_short: "*WRR*"

summary: Fluid flow and contaminant transport in heterogeneous porous media is critical in many applications from sustainable groundwater quality management to radioactive waste disposal and water filtration. Accurate contaminant transport modeling is challenged by anomalous (non-Fickian) transport, characterized by early breakthrough, long tailing, non-Gaussian or multipeaked plume shapes, and non-linear scaling of the mean square displacement. 


header:
  caption: ''
  image: ''
image:
  caption: "Contaminant transport in a heterogeneous alluvial aquifer under varying hydraulic gradients"
links:
url_pdf: ''
#url_code: 'https://github.com/richpauloo/well_failure'
#url_dataset: 'https://datadryad.org/stash/dataset/doi:10.25338/B8Q31D'
url_poster: 'https://essoar.org/doi/10.1002/essoar.10501680.1'
#url_project: ''
#url_slides: ''
#url_source: ''
#url_video: ''

math: true
---

### Abstract

Fluid flow and contaminant transport in heterogeneous porous media is critical in many applications from sustainable groundwater quality management to radioactive waste disposal and water filtration. Accurate contaminant transport modeling is challenged by anomalous (non-Fickian) transport, characterized by early breakthrough, long tailing, non-Gaussian or multipeaked plume shapes, and non-linear scaling of the mean square displacement. 

In regional alluvial aquifers, it is unknown how emerging nonpoint source contamination (e.g., salts and nitrates) will interact with aquifer heterogeneity and shifting hydraulic gradients. Pumping and recharge for irrigation significantly shift the magnitude and direction of regional hydraulic gradients but how variations in the hydraulic gradients, particularly direction, impact non-Fickian transport remains, to our knowledge, unexplored. We investigate the influence of hydraulic gradients on non-Fickian transport with a simple concept, the vertical to horizontal gradient ratio (VHGR):  

$$ VHGR = \frac{\partial h / \partial z}{\partial h / \partial y}$$  

Large VHGR is predominately vertical flow and flow is increasingly horizontal as VHGR decreases toward 1.  

In horizontally stratified clastic sedimentary deposits, horizontal $K'$ is commonly 100 to 10,000 times greater than vertical $K'$. In these systems, groundwater pumping at depth and irrigation recharge from above create very large VHGR (e.g., 100). When pumping and/or recharge is decreased, VHGR values typical of pre-development conditions (e.g., 1 to 10) can prevail. This works shows that the significance of non-Fickian transport processes depends greatly on these differing hydraulic gradient forcings.  

We test three hypothetical VHGR scenarios representing intensive to reduced pumping (VHGR = 100, 10, 1) in a highly stratified heterogeneous alluvial aquifer. We find that lower VHGR in our study site results in increased non-Fickian behavior, illustrated by increased spreading in longitudinal and transverse directions, and increased mass holdback and tailing. Thus, regional-scale nonpoint source contaminant management under reduced pumping and recharge may need to account for increased non-Fickian transport (i.e., longer contaminant residence and greater spatial spreading) than previously considered. Conversely, under conditions of strong vertical gradients that drive mass more or less straight through confining beds rather than allowing mass to find preferential flowpaths around them, the ADE may be a very good approximation of the transport physics.  


{{< figure library="true" src="vhgr_part_traj.gif" title="Cross section in zy for 10 random particle trajectories. The title in the upper-left corner indicates the simulation. As VHGR approaches 1 (dh/dz = dh/dy), particle paths are increasingly dispersed, tortuous, and show marked tailing. Particles that exit the bottom of the domain are selected for visualization purposes (although as VHGR decreases, mass is increasingly held back in fines, causing some particles to remain trapped near the source)." >}}
